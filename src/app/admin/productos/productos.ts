import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.scss']
})
export class ProductosComponent {
  productos: Producto[] = [
    { id: 1, nombre: 'Camiseta Hombre', categoria: 'Ropa', precio: 49.9, stock: 20, imagenUrl: 'https://via.placeholder.com/70' },
    { id: 2, nombre: 'Pantalón Mujer', categoria: 'Ropa', precio: 89.5, stock: 5 },
    { id: 3, nombre: 'Zapatillas', categoria: 'Calzado', precio: 199.9, stock: 0 }
  ];

  buscador = '';
  filtroStock = 'todos';

  nuevoProducto: Producto = { id: 0, nombre: '', categoria: '', precio: 0, stock: 0 };

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(this.buscador.toLowerCase());
      const estado = this.getEstado(p.stock);
      const coincideStock = this.filtroStock === 'todos' || estado === this.filtroStock;
      return coincideNombre && coincideStock;
    });
  }

  getEstado(stock: number): string {
    if (stock === 0) return 'sin-stock';
    if (stock > 0 && stock < 10) return 'bajo-stock';
    return 'en-stock';
  }

  agregarProducto() {
    if (this.nuevoProducto.nombre.trim() === '') return;
    const nuevo: Producto = { ...this.nuevoProducto, id: this.productos.length + 1 };
    this.productos.push(nuevo);
    this.nuevoProducto = { id: 0, nombre: '', categoria: '', precio: 0, stock: 0 };
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }
}
