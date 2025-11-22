import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  formularioRegistro: FormGroup;
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor() {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      rol: ['mesero', [Validators.required]]
    }, {
      validators: this.validarPasswordsIguales
    });
  }

  // Getters
  get nombre() {
    return this.formularioRegistro.get('nombre');
  }

  get email() {
    return this.formularioRegistro.get('email');
  }

  get password() {
    return this.formularioRegistro.get('password');
  }

  get confirmarPassword() {
    return this.formularioRegistro.get('confirmarPassword');
  }

  get rol() {
    return this.formularioRegistro.get('rol');
  }

  /**
   * Validador personalizado: verificar que las contraseñas coincidan
   */
  validarPasswordsIguales(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmarPassword = group.get('confirmarPassword')?.value;
    
    if (password !== confirmarPassword) {
      return { passwordsNoCoinciden: true };
    }
    return null;
  }

  /**
   * Enviar formulario de registro
   */
  async onSubmit(): Promise<void> {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const { nombre, email, password, rol } = this.formularioRegistro.value;

    try {
      await this.autenticacionService.registrar(email, password, nombre, rol);
      
      this.mensajeExito = '¡Registro exitoso! Redirigiendo...';
      
      // Esperar 2 segundos y redirigir al login
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      
    } catch (error: any) {
      this.mensajeError = error;
      this.cargando = false;
    }
  }

  /**
   * Ir al login
   */
  irALogin(): void {
    this.router.navigate(['/login']);
  }
}