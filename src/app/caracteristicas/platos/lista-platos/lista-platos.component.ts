import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlatosService } from '../../../servicios/platos.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { MonedaPipe } from '../../../compartido/tubos/moneda.pipe';
import { Plato, CategoriaPlato } from '../../../modelos';

@Component({
  selector: 'app-lista-platos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MonedaPipe],
  templateUrl: './lista-platos.component.html',
  styleUrl: './lista-platos.component.css'
})
export class ListaPlatosComponent implements OnInit {
  private platosService = inject(PlatosService);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  platos: Plato[] = [];
  platosFiltrados: Plato[] = [];
  cargando = true;
  
  // Filtros
  textoBusqueda = '';
  categoriaSeleccionada = '';
  soloDisponibles = false;

  // Categorías para el filtro
  categorias = ['Todas', ...Object.values(CategoriaPlato)];

  // Verificar si es admin
  esAdmin = this.autenticacionService.esAdministrador();

  ngOnInit(): void {
    this.cargarPlatos();
  }

  /**
   * Cargar platos desde Firestore
   */
  cargarPlatos(): void {
    this.platosService.obtenerPlatos().subscribe({
      next: (platos) => {
        this.platos = platos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar platos:', error);
        this.cargando = false;
      }
    });
  }

  /**
   * Aplicar filtros de búsqueda
   */
  aplicarFiltros(): void {
    this.platosFiltrados = this.platos.filter(plato => {
      // Filtro por texto
      const coincideTexto = plato.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
                           plato.descripcion.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      
      // Filtro por categoría
      const coincideCategoria = !this.categoriaSeleccionada || 
                               this.categoriaSeleccionada === 'Todas' ||
                               plato.categoria === this.categoriaSeleccionada;
      
      // Filtro por disponibilidad
      const coincideDisponibilidad = !this.soloDisponibles || plato.disponible;

      return coincideTexto && coincideCategoria && coincideDisponibilidad;
    });
  }

  /**
   * Ir a agregar nuevo plato
   */
  agregarPlato(): void {
    this.router.navigate(['/platos/nuevo']);
  }

  /**
   * Ir a editar plato
   */
  editarPlato(id: string): void {
    this.router.navigate(['/platos/editar', id]);
  }

  /**
   * Cambiar disponibilidad del plato
   */
  async toggleDisponibilidad(plato: Plato): Promise<void> {
    if (!plato.id) return;

    try {
      await this.platosService.cambiarDisponibilidad(plato.id, !plato.disponible);
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      alert('Error al cambiar la disponibilidad del plato');
    }
  }

  /**
   * Eliminar plato
   */
  async eliminarPlato(plato: Plato): Promise<void> {
    if (!plato.id) return;

    const confirmar = confirm(`¿Estás seguro de eliminar "${plato.nombre}"?`);
    
    if (confirmar) {
      try {
        await this.platosService.eliminarPlato(plato.id);
        alert('Plato eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar plato:', error);
        alert('Error al eliminar el plato');
      }
    }
  }
}