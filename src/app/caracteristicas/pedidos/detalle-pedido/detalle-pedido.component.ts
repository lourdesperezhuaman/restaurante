import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidosService } from '../../../servicios/pedidos.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { MonedaPipe } from '../../../compartido/tubos/moneda.pipe';
import { FechaFirebasePipe } from '../../../compartido/tubos/fecha-firebase.pipe';
import { Pedido, EstadoPedido } from '../../../modelos';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink, MonedaPipe, FechaFirebasePipe],
  templateUrl: './detalle-pedido.component.html',
  styleUrl: './detalle-pedido.component.css'
})
export class DetallePedidoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidosService = inject(PedidosService);
  private autenticacionService = inject(AutenticacionService);

  pedido: Pedido | null = null;
  cargando = true;
  esAdmin = this.autenticacionService.esAdministrador();
  EstadoPedido = EstadoPedido;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPedido(id);
    } else {
      this.router.navigate(['/pedidos']);
    }
  }

  cargarPedido(id: string): void {
    this.pedidosService.obtenerPedidoPorId(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar pedido:', error);
        this.router.navigate(['/pedidos']);
      }
    });
  }

  async cambiarEstado(nuevoEstado: EstadoPedido): Promise<void> {
    if (!this.pedido?.id) return;
    try {
      await this.pedidosService.actualizarEstado(this.pedido.id, nuevoEstado);
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  }

  obtenerSiguienteEstado(): EstadoPedido | null {
    if (!this.pedido) return null;
    switch (this.pedido.estado) {
      case EstadoPedido.PENDIENTE: return EstadoPedido.EN_PREPARACION;
      case EstadoPedido.EN_PREPARACION: return EstadoPedido.LISTO;
      case EstadoPedido.LISTO: return EstadoPedido.ENTREGADO;
      default: return null;
    }
  }

  volver(): void {
    this.router.navigate(['/pedidos']);
  }
}