import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagina-no-encontrada',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagina-no-encontrada.component.html',
  styleUrl: './pagina-no-encontrada.component.css'
})
export class PaginaNoEncontradaComponent {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
} 