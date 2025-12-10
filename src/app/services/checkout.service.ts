import { CarritoService } from './carrito.service';
import { Injectable } from '@angular/core';
import { CompraService } from './compra.service'; // Importa el servicio HTTP
import { CheckoutData, DespachoData, PagoData, PersonalData } from './checkout-data.model';
import { BehaviorSubject, Observable } from 'rxjs';

const INITIAL_DATA: CheckoutData = {
  personal: { nombres: '', apellidos: '', email: '', telefono: '' },
  despacho: null,
  pago: null,
  productos: [],
  total: 0,
};

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutDataSubject = new BehaviorSubject<CheckoutData>(INITIAL_DATA);
  checkoutData$: Observable<CheckoutData> = this.checkoutDataSubject.asObservable();

  constructor(private carritoService: CarritoService, private compraService: CompraService) {}

  setPersonalData(data: PersonalData): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, personal: data });
  }

  setDespachoData(data: DespachoData): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, despacho: data });
  }

  setPagoData(data: PagoData): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, pago: data });
  }

  getCurrentData(): CheckoutData {
    return this.checkoutDataSubject.value;
  }

  procesarCompra(): Observable<any> {
    const data = this.checkoutDataSubject.value;
    const productos = this.carritoService.obtenerCarrito();

    // Armamos el JSON tal cual lo probaste en Postman
    const requestBody = {
      destinatario: {
        nombreCompleto: data.personal.nombres,
        apellidos: data.personal.apellidos,
        telefono: data.personal.telefono,
        email: data.personal.email
      },

      envio: {
        tipoEnvio: data.despacho?.tipo === 'envio' ? 'DELIVERY' : 'RECOJO_TIENDA',
        direccionEnvio: data.despacho?.direccion || '',
        ciudad: data.despacho?.ciudad || '',
        referencia: data.despacho?.referencia || ''
      },

      pago: {
        tipoPago: data.pago?.metodo === 'tarjeta' ? 'TARJETA' : 'YAPE'
      },

      detalles: productos.map(p => ({
        productoId: p.id,
        cantidad: p.cantidad
      })),

      tipoComprobante: 'BOLETA'
    };

    console.log("🚀 Enviando JSON al Backend:", requestBody);
    return this.compraService.guardarCompra(requestBody);
  }

  clearData(): void {
    this.checkoutDataSubject.next(INITIAL_DATA);
    this.carritoService.limpiarCarrito();
  }
}
