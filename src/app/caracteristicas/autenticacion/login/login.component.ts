import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  formularioLogin: FormGroup;
  cargando = false;
  mensajeError = '';

  constructor() {
    // Crear el formulario con validaciones
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para acceder a los campos del formulario
  get email() {
    return this.formularioLogin.get('email');
  }

  get password() {
    return this.formularioLogin.get('password');
  }

  /**
   * Enviar el formulario de login
   */
  async onSubmit(): Promise<void> {
    // Marcar todos los campos como tocados para mostrar errores
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { email, password } = this.formularioLogin.value;

    try {
      await this.autenticacionService.iniciarSesion(email, password);
      // La redirección se maneja en el servicio
    } catch (error: any) {
      this.mensajeError = error;
      this.cargando = false;
    }
  }

  /**
   * Ir a la página de registro
   */
  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}