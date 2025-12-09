import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoService, ItemCarrito } from './carrito.service'; 
import {
  CheckoutData,
  PersonalData,
  DespachoData,
  PagoData,
} from './checkout-data.model';

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

  constructor(private carritoService: CarritoService) {}

  // Usado en Paso 1
  setPersonalData(data: PersonalData): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, personal: data });
  }

  // Usado en Paso 2
  setDespachoData(data: DespachoData): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, despacho: data });
  }
  
  // Usado en Paso 3
  setPagoData(data: PagoData): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, pago: data });
  }

  // Usado para precargar datos al volver a un paso
  getCurrentData(): CheckoutData {
    return this.checkoutDataSubject.value;
  }

  // Usado SOLO en Paso 3 (Método de Pago) para consolidar
  getFinalPayload(): CheckoutData {
    const data = this.checkoutDataSubject.value;
    const productos = this.carritoService.obtenerCarrito(); 
    const total = this.carritoService.calcularTotal();

    return {
      ...data,
      productos: productos,
      total: total,
    };
  }

  // Usado después de una compra exitosa
  clearData(): void {
    this.checkoutDataSubject.next(INITIAL_DATA);
    this.carritoService.limpiarCarrito();
  }
}