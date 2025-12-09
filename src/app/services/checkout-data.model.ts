import { ItemCarrito } from './carrito.service'; // Ajusta la ruta si es necesario

export interface PersonalData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
}

export interface DespachoData {
  tipo: 'retiro' | 'envio' | string;
  direccion?: string;
  ciudad?: string;
  referencia?: string;
  fechaEntrega?: string;
}

export interface PagoData {
  metodo: string;
  numeroTarjeta?: string;
  fecha?: string;
  cvv?: string;
}

export interface CheckoutData {
  personal: PersonalData;
  despacho: DespachoData | null;
  pago: PagoData | null;
  productos: ItemCarrito[];
  total: number;
}