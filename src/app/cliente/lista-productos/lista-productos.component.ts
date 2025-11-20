import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoComponent } from '../carrito/carrito';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, CarritoComponent],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.scss']
})
export class ListaProductosComponent {

  productos = [
    { id: 1, nombre: "Gorro", precio: 200, categoria: "Gorro", imagen: "../../assets/img/p1.png", stock: 14 },
    { id: 2, nombre: "Overside Polera", precio: 120, categoria: "Polera", imagen: "assets/img/p2.png", stock: 10 },
  ];

  productosFiltrados = [...this.productos];

  minPrice: number | null = null;
  maxPrice: number | null = null;
  searchTerm: string = '';

  constructor(private carritoService: CarritoService) {}

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);

    setTimeout(() => {
      const cartEl = document.getElementById('cartCanvas');
      if (cartEl) {
        const bsCart = new (window as any).bootstrap.Offcanvas(cartEl);
        bsCart.show();
      }
    });
  }

  filterCategory(categoria: string) {
    this.productosFiltrados = this.productos.filter(p => p.categoria === categoria);
  }

  applyFilters() {
    this.productosFiltrados = this.productos.filter(p => {
      const passesMin = this.minPrice === null || p.precio >= this.minPrice;
      const passesMax = this.maxPrice === null || p.precio <= this.maxPrice;
      return passesMin && passesMax;
    });
  }

  clearFilters() {
    this.minPrice = null;
    this.maxPrice = null;
    this.searchTerm = '';
    this.productosFiltrados = [...this.productos];
  }

  searchProducts() {
    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term)
    );
  }
}
