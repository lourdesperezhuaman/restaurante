import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  usuario$ = user(this.auth);
  usuarioActual = signal<Usuario | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (usuarioAuth: User | null) => {
      if (usuarioAuth) {
        this.cargarDatosUsuario(usuarioAuth.uid);
      } else {
        this.usuarioActual.set(null);
      }
    });
  }

  async registrar(email: string, password: string, nombre: string, rol: 'mesero' | 'administrador'): Promise<void> {
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, password);
      const nuevoUsuario: Usuario = {
        uid: credencial.user.uid,
        nombre: nombre,
        email: email,
        rol: rol,
        fechaCreacion: new Date(),
        activo: true
      };
      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), nuevoUsuario);
    } catch (error: any) {
      throw this.manejarError(error);
    }
  }

  async iniciarSesion(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/']);
    } catch (error: any) {
      throw this.manejarError(error);
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await signOut(this.auth);
      this.usuarioActual.set(null);
      this.router.navigate(['/login']);
    } catch (error: any) {
      throw error;
    }
  }

  private async cargarDatosUsuario(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const datosUsuario = docSnap.data() as Usuario;
        this.usuarioActual.set(datosUsuario);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  esAdministrador(): boolean {
    return this.usuarioActual()?.rol === 'administrador';
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual();
  }

  private manejarError(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email': return 'El correo electrónico no es válido';
      case 'auth/user-disabled': return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found': return 'No existe una cuenta con este correo';
      case 'auth/wrong-password': return 'Contraseña incorrecta';
      case 'auth/email-already-in-use': return 'Este correo ya está registrado';
      case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-credential': return 'Credenciales inválidas';
      default: return 'Ocurrió un error. Intenta de nuevo';
    }
  }
}