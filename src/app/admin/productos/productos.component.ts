// productos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from './../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.scss']
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];

  // Formulario reactivo para nuevo producto
  productoForm!: FormGroup;

  // Formulario reactivo para filtros
  filtrosForm!: FormGroup;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormularioProducto();
    this.crearFormularioFiltros();
    this.cargarProductos();
  }

  // -------------------------
  // Formulario Nuevo Producto
  // -------------------------
  crearFormularioProducto() {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      imagenUrl: ['']
    });
  }

  // -------------------------
  // Formulario Filtros
  // -------------------------
  crearFormularioFiltros() {
    this.filtrosForm = this.fb.group({
      buscador: [''],
      filtroStock: ['todos']
    });
  }

  // -------------------------
  // Cargar Productos
  // -------------------------
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: data => this.productos = data,
      error: err => console.error("Error al obtener productos:", err)
    });
  }

  // -------------------------
  // Filtro Productos
  // -------------------------
  get productosFiltrados(): Producto[] {
    const buscador = this.filtrosForm.get('buscador')?.value.toLowerCase() || '';
    const filtroStock = this.filtrosForm.get('filtroStock')?.value || 'todos';

    return this.productos.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(buscador);
      const estado = this.getEstado(p.stock);
      const coincideStock = filtroStock === 'todos' || estado === filtroStock;
      return coincideNombre && coincideStock;
    });
  }

  getEstado(stock: number): string {
    if (stock === 0) return 'sin-stock';
    if (stock > 0 && stock < 10) return 'bajo-stock';
    return 'en-stock';
  }

  // -------------------------
  // Agregar Producto
  // -------------------------
  agregarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const nuevoProducto: Producto = this.productoForm.value;

    this.productoService.createProducto(nuevoProducto).subscribe({
      next: () => {
        this.cargarProductos();
        this.productoForm.reset({
          nombre: '',
          categoria: '',
          precio: 0,
          stock: 0,
          descripcion: '',
          imagenUrl: ''
        });
      }
    });
  }

  // -------------------------
  // Eliminar Producto
  // -------------------------
  eliminarProducto(id: number) {
    if (!confirm('¿Eliminar producto?')) return;

    this.productoService.deleteProducto(id).subscribe({
      next: () => this.cargarProductos()
    });
  }

}
