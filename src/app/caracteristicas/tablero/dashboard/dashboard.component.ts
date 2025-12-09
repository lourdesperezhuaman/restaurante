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

  // Estadísticas
  totalVentasHoy = 0;
  cantidadPedidosHoy = 0;
  pedidosPendientes = 0;
  pedidosEntregados = 0;
  platosVendidosHoy = 0;
  
  // Top platos
  platosMasVendidos: EstadisticasPlato[] = [];
  
  // Datos para gráficos
  pedidosPorEstado: { estado: string; cantidad: number; porcentaje: number }[] = [];
  
  cargando = true;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  /**
   * Cargar todas las estadísticas
   */
  cargarEstadisticas(): void {
    // Obtener pedidos del día
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

  /**
   * Calcular todas las estadísticas
   */
/**
 * Calcular todas las estadísticas
 */
calcularEstadisticas(pedidos: Pedido[]): void {
  // RESETEAR TODOS LOS CONTADORES PRIMERO
  this.totalVentasHoy = 0;
  this.cantidadPedidosHoy = 0;
  this.pedidosPendientes = 0;
  this.pedidosEntregados = 0;
  this.platosVendidosHoy = 0; // ← AGREGAR ESTA LÍNEA
  this.platosMasVendidos = [];
  this.pedidosPorEstado = [];
  
  // Total de ventas del día
  this.totalVentasHoy = pedidos.reduce((total, pedido) => total + pedido.total, 0);
  
  // Cantidad de pedidos
  this.cantidadPedidosHoy = pedidos.length;
  
  // Pedidos por estado
  this.pedidosPendientes = pedidos.filter(p => p.estado === EstadoPedido.PENDIENTE || p.estado === EstadoPedido.EN_PREPARACION).length;
  this.pedidosEntregados = pedidos.filter(p => p.estado === EstadoPedido.ENTREGADO).length;
  
  // Calcular platos vendidos
  this.calcularPlatosVendidos(pedidos);
  
  // Calcular distribución por estado
  this.calcularPedidosPorEstado(pedidos);
}

  /**
   * Calcular los platos más vendidos
   */
  calcularPlatosVendidos(pedidos: Pedido[]): void {
    const mapaPlatos = new Map<string, EstadisticasPlato>();
    
    // Recorrer todos los pedidos
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
        
        // Incrementar total de platos vendidos
        this.platosVendidosHoy += articulo.cantidad;
      });
    });
    
    // Convertir a array y ordenar por cantidad
    this.platosMasVendidos = Array.from(mapaPlatos.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5); // Top 5
  }

  /**
   * Calcular distribución de pedidos por estado
   */
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
    
    const total = pedidos.length || 1; // Evitar división por cero
    
    this.pedidosPorEstado = Object.entries(contadores)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([estado, cantidad]) => ({
        estado,
        cantidad,
        porcentaje: Math.round((cantidad / total) * 100)
      }));
  }

  /**
   * Obtener clase CSS según el estado
   */
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case EstadoPedido.PENDIENTE:
        return 'estado-pendiente';
      case EstadoPedido.EN_PREPARACION:
        return 'estado-preparacion';
      case EstadoPedido.LISTO:
        return 'estado-listo';
      case EstadoPedido.ENTREGADO:
        return 'estado-entregado';
      case EstadoPedido.CANCELADO:
        return 'estado-cancelado';
      default:
        return '';
    }
  }

  /**
   * Recargar estadísticas
   */
  recargar(): void {
    this.cargando = true;
    this.cargarEstadisticas();
  }
}