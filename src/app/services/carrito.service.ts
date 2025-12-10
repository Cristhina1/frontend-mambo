import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrito } from '../models/carrito.model';



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

  // En carrito.service.ts

agregarProducto(producto: any) {
  // 1. VALIDACIÓN INICIAL: Si no hay stock, no hace nada
  if (!producto.stock || producto.stock <= 0) {
    alert("Este producto está agotado.");
    return;
  }

  const existente = this.carrito.find(p => p.id === producto.id);

  if (existente) {
    // 2. VALIDACIÓN AL SUMAR: Solo suma si no supera el stock
    if (existente.cantidad < existente.stockMaximo) {
      existente.cantidad++;
    } else {
      alert(`Solo quedan ${existente.stockMaximo} unidades de este producto.`);
    }
  } else {
    // 3. AGREGAR NUEVO: Guardamos el stock real del producto
    const itemToAdd: ItemCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img || producto.imagen || 'assets/no-image.png',
      cantidad: 1,
      stockMaximo: producto.stock // <--- GUARDAMOS EL LÍMITE
    };
    this.carrito.push(itemToAdd);
  }

  this.guardarStore();
}

aumentarCantidad(id: number) {
  const item = this.carrito.find(p => p.id === id);

  if (item) {
    // 4. VALIDACIÓN EN EL BOTÓN (+):
    if (item.cantidad < item.stockMaximo) {
      item.cantidad++;
      this.guardarStore();
    } else {
      // Opcional: mostrar alerta o simplemente no hacer nada
      console.log("Stock máximo alcanzado");
    }
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
