import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  img?: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: ItemCarrito[] = [];

  private carritoSubject = new BehaviorSubject<ItemCarrito[]>(this.carrito);
  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) {
      this.carrito = JSON.parse(guardado);
      this.carritoSubject.next(this.carrito);
    }
  }

  private guardarStore(){
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.carritoSubject.next([...this.carrito]);
  }

  agregarProducto(producto: any) {
    const itemToAdd: ItemCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img || producto.img || 'assets/no-image.png', // Mapeo de seguridad
      cantidad: 1
    };

    const existente = this.carrito.find(p => p.id === itemToAdd.id);

    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({
        ...producto,
        cantidad: 1
      });
    }

    this.guardarStore();
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
