import { ProductService, Producto } from './../../services/product';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.scss']
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  buscador = '';
  filtroStock = 'todos';

  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagenUrl: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // 👉 Método reutilizable
  cargarProductos() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log("Productos cargados:", data);
      },
      error: (err) => console.error("Error al obtener productos:", err)
    });
  }

  // -------------------------
  // FILTRO
  // -------------------------
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

  // -------------------------
  // AGREGAR
  // -------------------------
  agregarProducto() {
    if (!this.nuevoProducto.nombre.trim()) return;

    this.productService.addProducto(this.nuevoProducto).subscribe({
      next: (nuevo) => {
        console.log("Producto agregado desde API:", nuevo);
        this.cargarProductos(); // refrescar tabla
      }
    });

    // Reset formulario
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      categoria: '',
      precio: 0,
      stock: 0,
      descripcion: '',
      imagenUrl: ''
    };
  }

  // -------------------------
  // ELIMINAR
  // -------------------------
  eliminarProducto(id: number) {
    this.productService.deleteProducto(id).subscribe({
      next: () => {
        console.log("Producto eliminado:", id);
        this.cargarProductos(); // refrescar tabla
      }
    });
  }

}
