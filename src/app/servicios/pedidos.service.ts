import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, docData, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pedido, EstadoPedido, ArticuloPedido } from '../modelos';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private firestore: Firestore = inject(Firestore);
  private coleccionPedidos = collection(this.firestore, 'pedidos');

  /**
   * Obtener todos los pedidos (ordenados por fecha, más recientes primero)
   */
  obtenerPedidos(): Observable<Pedido[]> {
    const consulta = query(
      this.coleccionPedidos,
      orderBy('fechaCreacion', 'desc')
    );
    
    return collectionData(consulta, { idField: 'id' }) as Observable<Pedido[]>;
  }

  /**
   * Obtener pedidos por estado
   */
  obtenerPedidosPorEstado(estado: EstadoPedido): Observable<Pedido[]> {
    const consulta = query(
      this.coleccionPedidos,
      where('estado', '==', estado),
      orderBy('fechaCreacion', 'desc')
    );
    
    return collectionData(consulta, { idField: 'id' }) as Observable<Pedido[]>;
  }

  /**
   * Obtener pedidos de un mesero específico
   */
  obtenerPedidosPorMesero(meseroId: string): Observable<Pedido[]> {
    const consulta = query(
      this.coleccionPedidos,
      where('meseroId', '==', meseroId),
      orderBy('fechaCreacion', 'desc')
    );
    
    return collectionData(consulta, { idField: 'id' }) as Observable<Pedido[]>;
  }

  /**
   * Obtener un pedido por ID
   */
  obtenerPedidoPorId(id: string): Observable<Pedido> {
    const docRef = doc(this.firestore, 'pedidos', id);
    return docData(docRef, { idField: 'id' }) as Observable<Pedido>;
  }

  /**
   * Crear un nuevo pedido
   */
  async crearPedido(pedido: Omit<Pedido, 'id'>): Promise<string> {
    try {
      const nuevoPedido = {
        ...pedido,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      const docRef = await addDoc(this.coleccionPedidos, nuevoPedido);
      console.log('✅ Pedido creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      throw error;
    }
  }

  /**
   * Actualizar un pedido
   */
  async actualizarPedido(id: string, pedido: Partial<Pedido>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'pedidos', id);
      await updateDoc(docRef, {
        ...pedido,
        fechaActualizacion: new Date()
      });
      console.log('✅ Pedido actualizado:', id);
    } catch (error) {
      console.error('❌ Error al actualizar pedido:', error);
      throw error;
    }
  }

  /**
   * Actualizar solo el estado del pedido
   */
  async actualizarEstado(id: string, nuevoEstado: EstadoPedido): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'pedidos', id);
      await updateDoc(docRef, {
        estado: nuevoEstado,
        fechaActualizacion: new Date()
      });
      console.log(`✅ Estado actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      throw error;
    }
  }

  /**
   * Eliminar un pedido
   */
  async eliminarPedido(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'pedidos', id);
      await deleteDoc(docRef);
      console.log('✅ Pedido eliminado:', id);
    } catch (error) {
      console.error('❌ Error al eliminar pedido:', error);
      throw error;
    }
  }

  /**
   * Calcular el total de un pedido
   */
  calcularTotal(articulos: ArticuloPedido[]): number {
    return articulos.reduce((total, articulo) => total + articulo.subtotal, 0);
  }

  /**
   * Obtener pedidos del día actual
   */
  obtenerPedidosDelDia(): Observable<Pedido[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const consulta = query(
      this.coleccionPedidos,
      where('fechaCreacion', '>=', hoy),
      orderBy('fechaCreacion', 'desc')
    );
    
    return collectionData(consulta, { idField: 'id' }) as Observable<Pedido[]>;
  }
}