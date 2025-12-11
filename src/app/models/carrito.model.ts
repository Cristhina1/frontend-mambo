export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  img?: string;
  cantidad: number;
  stockMaximo: number;
}

export interface Compra{
  id : number;
  tipoEnvio: string;
  nombreDestinario: string;
  contactoDestinatario: string;
  tipoPago: string;
  total: number;
  estado: string;
  fechaCreacion: Date;
}
