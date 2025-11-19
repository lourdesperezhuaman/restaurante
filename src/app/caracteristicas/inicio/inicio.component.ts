import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  titulo = 'Bienvenido al Sistema de Pedidos';
  descripcion = 'Sistema de gestión para restaurantes';
}