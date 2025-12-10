import { ItemCarrito } from "../models/carrito.model";

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
