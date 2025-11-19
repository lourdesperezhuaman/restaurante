export interface Pedido {
  id?: string;                  
  numeroMesa: number;           
  meseroId: string;             
  meseroNombre: string;         
  articulos: ArticuloPedido[];  
  estado: EstadoPedido;         
  total: number;                
  fechaCreacion: Date;         
  fechaActualizacion: Date;   
  notas?: string;             
}

// Interface para cada artículo del pedido
export interface ArticuloPedido {
  platoId: string;              
  platoNombre: string;          
  cantidad: number;             
  precioUnitario: number;       
  subtotal: number;             
  notas?: string;               
}

// Enum para estados del pedido
export enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  EN_PREPARACION = 'En Preparación',
  LISTO = 'Listo',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado'
}