import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: ItemCarrito[] = [];

  private carritoSubject = new BehaviorSubject<ItemCarrito[]>(this.carrito);
  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  agregarProducto(producto: any) {
    const existente = this.carrito.find(p => p.id === producto.id);

    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({
        ...producto,
        cantidad: 1
      });
    }

    this.carritoSubject.next([...this.carrito]);
  }

  aumentarCantidad(id: number) {
    const item = this.carrito.find(p => p.id === id);
    if (item) {
      item.cantidad++;
      this.carritoSubject.next([...this.carrito]);
    }
  }

  disminuirCantidad(id: number) {
    const item = this.carrito.find(p => p.id === id);
    if (!item) return;

    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.eliminarProducto(id);
      return;
    }

    this.carritoSubject.next([...this.carrito]);
  }

  eliminarProducto(id: number) {
    this.carrito = this.carrito.filter(p => p.id !== id);
    this.carritoSubject.next([...this.carrito]);
  }

  limpiarCarrito() {
    this.carrito = [];
    this.carritoSubject.next([...this.carrito]);
  }

  calcularTotal(): number {
    return this.carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
  }

  obtenerCarrito(): ItemCarrito[] {
    return [...this.carrito];
  }
}
