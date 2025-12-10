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
  productoForm!: FormGroup;
  filtrosForm!: FormGroup;
  archivoSeleccionado: File | null = null; 

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
  }

  ngOnInit(): void {
    this.crearFormularioProducto();
    this.crearFormularioFiltros();
    this.cargarProductos();
  }

  // Captura el archivo del input HTML
  onFileSelected(event: any) {
    const archivo: File = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
    }
  }

  crearFormularioProducto() {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoriaNombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      imagenUrl: ['']
    });
  }

  crearFormularioFiltros() {
    this.filtrosForm = this.fb.group({
      buscador: [''],
      filtroStock: ['todos']
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: data => this.productos = data,
      error: err => console.error("Error al obtener productos:", err)
    });
  }

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

  agregarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('categoriaNombre', this.productoForm.get('categoriaNombre')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);
    formData.append('stock', this.productoForm.get('stock')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);

    if (this.archivoSeleccionado) {
      formData.append('imagenUrl', this.archivoSeleccionado);
    }

    this.productoService.createProducto(formData).subscribe({
      next: () => {
        this.cargarProductos();
        this.productoForm.reset();
        this.archivoSeleccionado = null;
      },
      error: (e) => console.error('Error al guardar', e)
    });
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Eliminar producto?')) return;
    this.productoService.deleteProducto(id).subscribe({
      next: () => this.cargarProductos()
    });
  }
}
