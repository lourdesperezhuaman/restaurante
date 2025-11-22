import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  // Inyección de dependencias
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Observable del usuario de Firebase
  usuario$ = user(this.auth);
  
  // Signal para el usuario actual (más moderno que Subject)
  usuarioActual = signal<Usuario | null>(null);

  constructor() {
    // Escuchar cambios en la autenticación
    this.usuario$.subscribe((usuarioAuth: User | null) => {
      if (usuarioAuth) {
        this.cargarDatosUsuario(usuarioAuth.uid);
      } else {
        this.usuarioActual.set(null);
      }
    });
  }

  /**
   * Registrar un nuevo usuario
   */
  async registrar(email: string, password: string, nombre: string, rol: 'mesero' | 'administrador'): Promise<void> {
    try {
      // Crear usuario en Firebase Auth
      const credencial = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Crear documento del usuario en Firestore
      const nuevoUsuario: Usuario = {
        uid: credencial.user.uid,
        nombre: nombre,
        email: email,
        rol: rol,
        fechaCreacion: new Date(),
        activo: true
      };

      // Guardar en Firestore
      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), nuevoUsuario);
      
      console.log('✅ Usuario registrado exitosamente');
    } catch (error: any) {
      console.error('❌ Error al registrar:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Iniciar sesión
   */
  async iniciarSesion(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Sesión iniciada exitosamente');
      this.router.navigate(['/pedidos']);
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Cerrar sesión
   */
  async cerrarSesion(): Promise<void> {
    try {
      await signOut(this.auth);
      this.usuarioActual.set(null);
      this.router.navigate(['/login']);
      console.log('✅ Sesión cerrada');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Cargar datos completos del usuario desde Firestore
   */
  private async cargarDatosUsuario(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const datosUsuario = docSnap.data() as Usuario;
        this.usuarioActual.set(datosUsuario);
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  /**
   * Verificar si el usuario es administrador
   */
  esAdministrador(): boolean {
    return this.usuarioActual()?.rol === 'administrador';
  }

  /**
   * Obtener el usuario actual
   */
  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual();
  }

  /**
   * Manejo de errores de Firebase
   */
  private manejarError(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Verifica tu correo y contraseña';
      default:
        return 'Ocurrió un error. Intenta de nuevo';
    }
  }
}