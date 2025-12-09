import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlatosService } from '../../../servicios/platos.service';
import { CategoriaPlato } from '../../../modelos';

@Component({
  selector: 'app-formulario-plato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-plato.component.html',
  styleUrl: './formulario-plato.component.css'
})
export class FormularioPlatoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private platosService = inject(PlatosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formularioPlato!: FormGroup;
  cargando = false;
  mensajeError = '';
  modoEdicion = false;
  platoId: string | null = null;

  // Categorías disponibles
  categorias = Object.values(CategoriaPlato);

  ngOnInit(): void {
    // Inicializar formulario
    this.formularioPlato = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: [CategoriaPlato.PLATO_PRINCIPAL, [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      disponible: [true],
      imagenUrl: ['']
    });

    // Verificar si estamos en modo edición
    this.platoId = this.route.snapshot.paramMap.get('id');
    
    if (this.platoId) {
      this.modoEdicion = true;
      this.cargarPlato(this.platoId);
    }
  }

  // Getters para validaciones
  get nombre() {
    return this.formularioPlato.get('nombre');
  }

  get descripcion() {
    return this.formularioPlato.get('descripcion');
  }

  get categoria() {
    return this.formularioPlato.get('categoria');
  }

  get precio() {
    return this.formularioPlato.get('precio');
  }

  /**
   * Cargar datos del plato en modo edición
   */
  private cargarPlato(id: string): void {
    this.platosService.obtenerPlatoPorId(id).subscribe({
      next: (plato) => {
        this.formularioPlato.patchValue({
          nombre: plato.nombre,
          descripcion: plato.descripcion,
          categoria: plato.categoria,
          precio: plato.precio,
          disponible: plato.disponible,
          imagenUrl: plato.imagenUrl || ''
        });
      },
      error: (error) => {
        console.error('Error al cargar plato:', error);
        this.mensajeError = 'No se pudo cargar el plato';
      }
    });
  }

  /**
   * Enviar formulario
   */
  async onSubmit(): Promise<void> {
    if (this.formularioPlato.invalid) {
      this.formularioPlato.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const datosPlato = this.formularioPlato.value;

    try {
      if (this.modoEdicion && this.platoId) {
        // Actualizar plato existente
        await this.platosService.actualizarPlato(this.platoId, datosPlato);
        console.log('✅ Plato actualizado');
      } else {
        // Crear nuevo plato
        await this.platosService.agregarPlato(datosPlato);
        console.log('✅ Plato creado');
      }

      // Redirigir a la lista
      this.router.navigate(['/platos']);
    } catch (error) {
      console.error('Error:', error);
      this.mensajeError = 'Ocurrió un error al guardar el plato';
      this.cargando = false;
    }
  }

  /**
   * Cancelar y volver
   */
  cancelar(): void {
    this.router.navigate(['/platos']);
  }
}