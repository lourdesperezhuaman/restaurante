import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../../servicios/pedidos.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { MonedaPipe } from '../../../compartido/tubos/moneda.pipe';
import { FechaFirebasePipe } from '../../../compartido/tubos/fecha-firebase.pipe'; // NUEVO
import { Pedido, EstadoPedido } from '../../../modelos';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MonedaPipe, FechaFirebasePipe], // AGREGADO
  templateUrl: './lista-pedidos.component.html',
  styleUrl: './lista-pedidos.component.css'
})
export class ListaPedidosComponent implements OnInit {
  private pedidosService = inject(PedidosService);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  cargando = true;

  // Filtros
  estadoSeleccionado = '';
  numeroMesaFiltro = '';

  // Estados disponibles
  estados = ['Todos', ...Object.values(EstadoPedido)];

  // Verificar si es admin
  esAdmin = this.autenticacionService.esAdministrador();
  usuarioActual = this.autenticacionService.obtenerUsuarioActual();

  // Enum para usar en el template
  EstadoPedido = EstadoPedido;

  ngOnInit(): void {
    this.cargarPedidos();
  }

  /**
   * Cargar pedidos desde Firestore
   */
  cargarPedidos(): void {
    const usuarioId = this.usuarioActual?.uid;

    // Si es mesero, solo ver sus pedidos
    const observable = this.esAdmin || !usuarioId
      ? this.pedidosService.obtenerPedidos()
      : this.pedidosService.obtenerPedidosPorMesero(usuarioId);

    observable.subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.cargando = false;
      }
    });
  }

  /**
   * Aplicar filtros
   */
  aplicarFiltros(): void {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      // Filtro por estado
      const coincideEstado = !this.estadoSeleccionado || 
                            this.estadoSeleccionado === 'Todos' ||
                            pedido.estado === this.estadoSeleccionado;
      
      // Filtro por mesa
      const coincideMesa = !this.numeroMesaFiltro || 
                          pedido.numeroMesa.toString().includes(this.numeroMesaFiltro);

      return coincideEstado && coincideMesa;
    });
  }

  /**
   * Ir a crear nuevo pedido
   */
/**
 * Ir a crear nuevo pedido
 */
crearPedido(): void {
  console.log('🔵 BOTÓN CLICKEADO - Iniciando navegación');
  console.log('Router:', this.router);
  try {
    this.router.navigate(['/pedidos/nuevo']);
    console.log('✅ Navigate ejecutado');
  } catch (error) {
    console.error('❌ Error en navigate:', error);
  }
}

  /**
   * Ver detalle del pedido
   */
  verDetalle(id: string): void {
    this.router.navigate(['/pedidos/detalle', id]);
  }

  /**
   * Cambiar estado del pedido
   */
  async cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido): Promise<void> {
    if (!pedido.id) return;

    try {
      await this.pedidosService.actualizarEstado(pedido.id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al actualizar el estado del pedido');
    }
  }

  /**
   * Eliminar pedido
   */
  async eliminarPedido(pedido: Pedido): Promise<void> {
    if (!pedido.id) return;

    const confirmar = confirm(`¿Estás seguro de eliminar el pedido de la Mesa ${pedido.numeroMesa}?`);
    
    if (confirmar) {
      try {
        await this.pedidosService.eliminarPedido(pedido.id);
        alert('Pedido eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
        alert('Error al eliminar el pedido');
      }
    }
  }

  /**
   * Obtener clase CSS según el estado
   */
  obtenerClaseEstado(estado: EstadoPedido): string {
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
   * Obtener el siguiente estado posible
   */
  obtenerSiguienteEstado(estadoActual: EstadoPedido): EstadoPedido | null {
    switch (estadoActual) {
      case EstadoPedido.PENDIENTE:
        return EstadoPedido.EN_PREPARACION;
      case EstadoPedido.EN_PREPARACION:
        return EstadoPedido.LISTO;
      case EstadoPedido.LISTO:
        return EstadoPedido.ENTREGADO;
      default:
        return null;
    }
  }
}