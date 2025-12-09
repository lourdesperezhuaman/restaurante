import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../../servicios/pedidos.service';
import { PlatosService } from '../../../servicios/platos.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { MonedaPipe } from '../../../compartido/tubos/moneda.pipe';
import { Plato, ArticuloPedido, EstadoPedido } from '../../../modelos';

@Component({
  selector: 'app-formulario-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MonedaPipe],
  templateUrl: './formulario-pedido.component.html',
  styleUrl: './formulario-pedido.component.css'
})
export class FormularioPedidoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pedidosService = inject(PedidosService);
  private platosService = inject(PlatosService);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  formularioPedido!: FormGroup;
  platosDisponibles: Plato[] = [];
  cargando = false;
  mensajeError = '';

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarPlatos();
  }

  /**
   * Inicializar el formulario
   */
  inicializarFormulario(): void {
    this.formularioPedido = this.fb.group({
      numeroMesa: [1, [Validators.required, Validators.min(1)]],
      articulos: this.fb.array([]),
      notas: ['']
    });
  }

  /**
   * Cargar platos disponibles
   */
  cargarPlatos(): void {
    this.platosService.obtenerPlatosDisponibles().subscribe({
      next: (platos) => {
        this.platosDisponibles = platos;
      },
      error: (error) => {
        console.error('Error al cargar platos:', error);
        this.mensajeError = 'Error al cargar los platos disponibles';
      }
    });
  }

  /**
   * Obtener el FormArray de artículos
   */
  get articulos(): FormArray {
    return this.formularioPedido.get('articulos') as FormArray;
  }

  /**
   * Crear un nuevo FormGroup para un artículo
   */
  crearArticulo(): FormGroup {
    return this.fb.group({
      platoId: ['', Validators.required],
      platoNombre: [''],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0],
      subtotal: [0],
      notas: ['']
    });
  }

  /**
   * Agregar un artículo al pedido
   */
  agregarArticulo(): void {
    this.articulos.push(this.crearArticulo());
  }

  /**
   * Eliminar un artículo del pedido
   */
  eliminarArticulo(indice: number): void {
    this.articulos.removeAt(indice);
  }

  /**
   * Cuando se selecciona un plato, actualizar los datos
   */
  onPlatoSeleccionado(indice: number, platoId: string): void {
    const plato = this.platosDisponibles.find(p => p.id === platoId);
    
    if (plato) {
      const articuloGroup = this.articulos.at(indice) as FormGroup;
      articuloGroup.patchValue({
        platoNombre: plato.nombre,
        precioUnitario: plato.precio
      });
      
      this.calcularSubtotal(indice);
    }
  }

  /**
   * Cuando cambia la cantidad, recalcular el subtotal
   */
  onCantidadCambiada(indice: number): void {
    this.calcularSubtotal(indice);
  }

  /**
   * Calcular el subtotal de un artículo
   */
  calcularSubtotal(indice: number): void {
    const articuloGroup = this.articulos.at(indice) as FormGroup;
    const cantidad = articuloGroup.get('cantidad')?.value || 0;
    const precioUnitario = articuloGroup.get('precioUnitario')?.value || 0;
    const subtotal = cantidad * precioUnitario;
    
    articuloGroup.patchValue({ subtotal });
  }

  /**
   * Calcular el total del pedido
   */
  calcularTotal(): number {
    let total = 0;
    this.articulos.controls.forEach(control => {
      total += control.get('subtotal')?.value || 0;
    });
    return total;
  }

  /**
   * Enviar el formulario
   */
  async onSubmit(): Promise<void> {
    if (this.formularioPedido.invalid) {
      this.formularioPedido.markAllAsTouched();
      return;
    }

    if (this.articulos.length === 0) {
      this.mensajeError = 'Debes agregar al menos un plato al pedido';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const usuarioActual = this.autenticacionService.obtenerUsuarioActual();
    
    if (!usuarioActual) {
      this.mensajeError = 'No se pudo identificar al usuario';
      this.cargando = false;
      return;
    }

    const datosPedido = {
      numeroMesa: this.formularioPedido.value.numeroMesa,
      meseroId: usuarioActual.uid,
      meseroNombre: usuarioActual.nombre,
      articulos: this.articulos.value,
      estado: EstadoPedido.PENDIENTE,
      total: this.calcularTotal(),
      notas: this.formularioPedido.value.notas || '',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    try {
      await this.pedidosService.crearPedido(datosPedido);
      alert('✅ Pedido creado exitosamente');
      this.router.navigate(['/pedidos']);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      this.mensajeError = 'Error al crear el pedido. Intenta de nuevo.';
      this.cargando = false;
    }
  }

  /**
   * Cancelar y volver
   */
  cancelar(): void {
    this.router.navigate(['/pedidos']);
  }
}