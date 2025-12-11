import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, CarritoComponent],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.scss']
})
export class ListaProductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  minPrice: number | null = null;
  maxPrice: number | null = null;
  searchTerm: string = '';

  constructor(
    private carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  // 🔥 CORREGIDO → Mapea imagenUrl correctamente
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data.map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          categoriaNombre: p.categoriaNombre,
          descripcion: p.descripcion,
          img: p.img ?`http://localhost:8080${p.img}` : 'assets/no-image.png',
          stock: p.stock
        }));

        this.productosFiltrados = [...this.productos];
        console.log("Productos desde API:", this.productos);
      },
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);

    setTimeout(() => {
      const cartEl = document.getElementById('cartCanvas');
      if (cartEl) {
        const bsCart = new (window as any).bootstrap.Offcanvas(cartEl);
        bsCart.show();
      }
    });
  }

  // FILTROS
  filterCategory(categoria: string) {
    this.productosFiltrados = this.productos.filter(p => p.categoriaNombre === categoria);
  }

  applyFilters() {
    this.productosFiltrados = this.productos.filter(p => {
      const min = this.minPrice === null || p.precio >= this.minPrice;
      const max = this.maxPrice === null || p.precio <= this.maxPrice;
      return min && max;
    });
  }

  clearFilters() {
    this.minPrice = null;
    this.maxPrice = null;
    this.searchTerm = '';
    this.productosFiltrados = [...this.productos];
  }

  searchProducts() {
    if (!this.searchTerm) {
      this.productosFiltrados = [...this.productos];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  get categoriasUnicas(): string[] {
  const categorias = this.productos.map(p => p.categoriaNombre);
  return [...new Set(categorias)].filter(c => c);
}
}
