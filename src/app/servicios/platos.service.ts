import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Plato, CategoriaPlato } from '../modelos';

@Injectable({
  providedIn: 'root'
})
export class PlatosService {
  private firestore: Firestore = inject(Firestore);
  private coleccionPlatos = collection(this.firestore, 'platos');

  /**
   * Obtener todos los platos (Observable en tiempo real)
   */
  obtenerPlatos(): Observable<Plato[]> {
    const consulta = query(
      this.coleccionPlatos,
      orderBy('nombre', 'asc')
    );
    
    return collectionData(consulta, { idField: 'id' }) as Observable<Plato[]>;
  }

  /**
   * Obtener platos disponibles solamente
   */
  obtenerPlatosDisponibles(): Observable<Plato[]> {
    const consulta = query(
      this.coleccionPlatos,
      where('disponible', '==', true),
      orderBy('nombre', 'asc')
    );
    
    return collectionData(consulta, { idField: 'id' }) as Observable<Plato[]>;
  }

  /**
   * Obtener un plato por ID
   */
  obtenerPlatoPorId(id: string): Observable<Plato> {
    const docRef = doc(this.firestore, 'platos', id);
    return docData(docRef, { idField: 'id' }) as Observable<Plato>;
  }

  /**
   * Agregar un nuevo plato
   */
  async agregarPlato(plato: Omit<Plato, 'id'>): Promise<string> {
    try {
      const nuevoPlato = {
        ...plato,
        fechaCreacion: new Date()
      };
      
      const docRef = await addDoc(this.coleccionPlatos, nuevoPlato);
      console.log('✅ Plato agregado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error al agregar plato:', error);
      throw error;
    }
  }

  /**
   * Actualizar un plato existente
   */
  async actualizarPlato(id: string, plato: Partial<Plato>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'platos', id);
      await updateDoc(docRef, { ...plato });
      console.log('✅ Plato actualizado:', id);
    } catch (error) {
      console.error('❌ Error al actualizar plato:', error);
      throw error;
    }
  }

  /**
   * Eliminar un plato
   */
  async eliminarPlato(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'platos', id);
      await deleteDoc(docRef);
      console.log('✅ Plato eliminado:', id);
    } catch (error) {
      console.error('❌ Error al eliminar plato:', error);
      throw error;
    }
  }

  /**
   * Cambiar disponibilidad de un plato
   */
  async cambiarDisponibilidad(id: string, disponible: boolean): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'platos', id);
      await updateDoc(docRef, { disponible });
      console.log(`✅ Plato ${disponible ? 'habilitado' : 'deshabilitado'}:`, id);
    } catch (error) {
      console.error('❌ Error al cambiar disponibilidad:', error);
      throw error;
    }
  }
}