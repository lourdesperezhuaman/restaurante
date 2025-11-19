export interface Usuario {
  uid: string;         
  nombre: string;       
  email: string;           
  rol: 'mesero' | 'administrador';  
  fechaCreacion: Date;     
  activo: boolean;          
}