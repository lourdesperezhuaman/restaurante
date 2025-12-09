import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  private autenticacionService = inject(AutenticacionService);
  
  titulo = 'Bienvenido al Sistema de Pedidos';
  descripcion = 'Sistema de gestión para restaurantes';
  
  esAdmin = this.autenticacionService.esAdministrador();
}