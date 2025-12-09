import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../../servicios/pedidos.service';
import { MonedaPipe } from '../../../compartido/tubos/moneda.pipe';
import { Pedido, EstadoPedido, ArticuloPedido } from '../../../modelos';

interface EstadisticasPlato {
  nombre: string;
  cantidad: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MonedaPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private pedidosService = inject(PedidosService);

  totalVentasHoy = 0;
  cantidadPedidosHoy = 0;
  pedidosPendientes = 0;
  pedidosEntregados = 0;
  platosVendidosHoy = 0;
  platosMasVendidos: EstadisticasPlato[] = [];
  pedidosPorEstado: { estado: string; cantidad: number; porcentaje: number }[] = [];
  cargando = true;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.pedidosService.obtenerPedidosDelDia().subscribe({
      next: (pedidos) => {
        this.calcularEstadisticas(pedidos);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas(pedidos: Pedido[]): void {
    this.totalVentasHoy = 0;
    this.cantidadPedidosHoy = 0;
    this.pedidosPendientes = 0;
    this.pedidosEntregados = 0;
    this.platosVendidosHoy = 0;
    this.platosMasVendidos = [];
    this.pedidosPorEstado = [];

    this.totalVentasHoy = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    this.cantidadPedidosHoy = pedidos.length;
    this.pedidosPendientes = pedidos.filter(p => p.estado === EstadoPedido.PENDIENTE || p.estado === EstadoPedido.EN_PREPARACION).length;
    this.pedidosEntregados = pedidos.filter(p => p.estado === EstadoPedido.ENTREGADO).length;
    
    this.calcularPlatosVendidos(pedidos);
    this.calcularPedidosPorEstado(pedidos);
  }

  calcularPlatosVendidos(pedidos: Pedido[]): void {
    this.platosVendidosHoy = 0;
    const mapaPlatos = new Map<string, EstadisticasPlato>();
    
    pedidos.forEach(pedido => {
      pedido.articulos.forEach(articulo => {
        const platoExistente = mapaPlatos.get(articulo.platoNombre);
        if (platoExistente) {
          platoExistente.cantidad += articulo.cantidad;
          platoExistente.total += articulo.subtotal;
        } else {
          mapaPlatos.set(articulo.platoNombre, {
            nombre: articulo.platoNombre,
            cantidad: articulo.cantidad,
            total: articulo.subtotal
          });
        }
        this.platosVendidosHoy += articulo.cantidad;
      });
    });
    
    this.platosMasVendidos = Array.from(mapaPlatos.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }

  calcularPedidosPorEstado(pedidos: Pedido[]): void {
    const contadores = {
      [EstadoPedido.PENDIENTE]: 0,
      [EstadoPedido.EN_PREPARACION]: 0,
      [EstadoPedido.LISTO]: 0,
      [EstadoPedido.ENTREGADO]: 0,
      [EstadoPedido.CANCELADO]: 0
    };
    
    pedidos.forEach(pedido => {
      contadores[pedido.estado]++;
    });
    
    const total = pedidos.length || 1;
    this.pedidosPorEstado = Object.entries(contadores)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([estado, cantidad]) => ({
        estado,
        cantidad,
        porcentaje: Math.round((cantidad / total) * 100)
      }));
  }

  obtenerColorEstado(estado: string): string {
    switch (estado) {
      case EstadoPedido.PENDIENTE: return '#ffc107';
      case EstadoPedido.EN_PREPARACION: return '#2196f3';
      case EstadoPedido.LISTO: return '#4caf50';
      case EstadoPedido.ENTREGADO: return '#9e9e9e';
      case EstadoPedido.CANCELADO: return '#f44336';
      default: return '#ddd';
    }
  }

  calcularDashArray(porcentaje: number): string {
    const circunferencia = 2 * Math.PI * 80;
    const longitud = (porcentaje / 100) * circunferencia;
    return `${longitud} ${circunferencia}`;
  }

  calcularDashOffset(index: number): number {
    const circunferencia = 2 * Math.PI * 80;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.pedidosPorEstado[i].porcentaje / 100) * circunferencia;
    }
    return -offset;
  }

  recargar(): void {
    this.cargando = true;
    this.cargarEstadisticas();
  }
}