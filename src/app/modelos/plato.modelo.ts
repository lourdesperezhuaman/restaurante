export interface Plato {
  id?: string;             
  nombre: string;          
  descripcion: string;    
  categoria: CategoriaPlato;
  precio: number;         
  disponible: boolean;     
  imagenUrl?: string;      
  fechaCreacion: Date;      
}

export enum CategoriaPlato {
  ENTRADA = 'Entrada',
  PLATO_PRINCIPAL = 'Plato Principal',
  POSTRE = 'Postre',
  BEBIDA = 'Bebida',
  OTRO = 'Otro'
}