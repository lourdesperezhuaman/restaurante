import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css'
})
export class BarraNavegacionComponent {
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  // aca obtenemos el usuario actual
  usuarioActual = this.autenticacionService.usuarioActual;
  
  // Computed esto hace ver si esta autenticado o no
  estaAutenticado = computed(() => this.usuarioActual() !== null);
  
  // Computed esto hace ver si es admin o no
  esAdministrador = computed(() => this.usuarioActual()?.rol === 'administrador');

  // Estado del menú móvil
  menuAbierto = false;

  /**
   * Alternar menú móvil
   */
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  /**
   * ACA cerramos sesion
   */
  async cerrarSesion(): Promise<void> {
    try {
      await this.autenticacionService.cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}