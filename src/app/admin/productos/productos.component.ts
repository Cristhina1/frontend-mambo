import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from './../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.scss'],
})
export class ProductosComponent implements OnInit {
  role!: string | null;
  modalTitulo: string = 'Nuevo Producto';
  modalBotonTexto: string = 'Guardar';
  isEditMode: boolean = false;
  productoIdEditar: number | null = null;

  productos: Producto[] = [];
  productoForm!: FormGroup;
  filtrosForm!: FormGroup;
  archivoSeleccionado: File | null = null;
  imagenUrlActual: string | null = null;

  constructor(private fb: FormBuilder, private productoService: ProductoService, private auth: AuthService) {}

  ngOnInit(): void {
    this.crearFormularioProducto();
    this.crearFormularioFiltros();
    this.cargarProductos();
    this.role = this.auth.getRole();
  }

  // Captura el archivo del input HTML

  crearFormularioProducto(producto?: Producto) {
    // Inicializa el formulario con valores del producto si está en modo edición, o vacíos si es nuevo
    this.productoForm = this.fb.group({
      nombre: [producto?.nombre || '', Validators.required],
      categoriaNombre: [producto?.categoriaNombre || '', Validators.required],
      precio: [producto?.precio || 0, [Validators.required, Validators.min(0)]],
      stock: [producto?.stock || 0, [Validators.required, Validators.min(0)]],
      descripcion: [producto?.descripcion || ''],
    });

    // Limpia la selección de archivo al inicializar/resetear el formulario
    this.archivoSeleccionado = null;
    this.imagenUrlActual = producto?.img || null; // Guarda la URL de la imagen si estamos editando
  }

  // Abre el modal en modo CREAR
  abrirModalCrear() {
    this.isEditMode = false;
    this.modalTitulo = 'Nuevo Producto';
    this.modalBotonTexto = 'Guardar';
    this.productoIdEditar = null;
    this.crearFormularioProducto(); // Llama sin argumentos para limpiar
  }

  // Abre el modal en modo EDITAR
  abrirModalEditar(producto: Producto) {
    this.isEditMode = true;
    this.modalTitulo = 'Editar Producto';
    this.modalBotonTexto = 'Actualizar';
    this.productoIdEditar = producto.id;
    this.crearFormularioProducto(producto); // Carga los datos del producto
  }

  crearFormularioFiltros() {
    this.filtrosForm = this.fb.group({
      buscador: [''],
      filtroStock: ['todos'],
      filtroCategoria: ['todas'], // AÑADE ESTA LÍNEA
    });
  }
  get categoriasUnicas(): string[] {
    const categorias = this.productosFiltrados.map((p) => p.categoriaNombre);
    return [...new Set(categorias)]; // Elimina duplicados
  }
  get productosFiltrados(): Producto[] {
    const buscador = this.filtrosForm.get('buscador')?.value.toLowerCase() || '';
    const filtroStock = this.filtrosForm.get('filtroStock')?.value || 'todos';
    const filtroCategoria = this.filtrosForm.get('filtroCategoria')?.value || 'todas';

    return this.productos.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(buscador);
      const estado = this.getEstado(p.stock);
      const coincideStock = filtroStock === 'todos' || estado === filtroStock;
      const coincideCategoria =
        filtroCategoria === 'todas' || p.categoriaNombre === filtroCategoria;

      return coincideNombre && coincideStock && coincideCategoria;
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: any[]) => {
        console.log('DATOS CRUDOS DEL BACKEND:', data);
        this.productos = data.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          categoriaNombre: p.categoriaNombre,
          stock: p.stock,
          descripcion: p.descripcion,
          img: p.img ? `http://localhost:8080${p.img}` : 'assets/no-image.png',
        }));

        console.log('Productos cargados:', this.productos);
        console.log('URL GENERADA:', this.productos[0]?.img);
      },
      error: (err) => console.error('Error', err),
    });
  }

  getEstado(stock: number): string {
    if (stock === 0) return 'sin-stock';
    if (stock > 0 && stock < 10) return 'bajo-stock';
    return 'en-stock';
  }

  guardarProducto() {
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

    // Si hay un nuevo archivo seleccionado, lo agrega
    if (this.archivoSeleccionado) {
      formData.append('imagenUrl', this.archivoSeleccionado);
    }

    if (this.isEditMode && this.productoIdEditar !== null) {
      // Lógica de ACTUALIZACIÓN (EDITAR)
      this.productoService.updateProducto(this.productoIdEditar, formData).subscribe({
        next: () => {
          console.log('Producto actualizado con éxito');
          this.cargarProductos();
        },
        error: (e) => console.error('Error al actualizar', e),
      });
    } else {
      // Lógica de CREACIÓN (AGREGAR)
      this.productoService.createProducto(formData).subscribe({
        next: () => {
          console.log('Producto agregado con éxito');
          this.cargarProductos();
        },
        error: (e) => console.error('Error al guardar', e),
      });
    }
    // Resetear el formulario después de la operación (opcional)
    this.productoForm.reset();
    this.archivoSeleccionado = null;
  }

  onFileSelected(event: any) {
    const archivo: File = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
    }
  }

  eliminarProducto(id: number | undefined) {
    if (id === undefined) {
      console.error('ID del producto no definido.');
      return;
    }
    if (
      !confirm(
        '⚠️ ¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer.'
      )
    )
      return;
    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        console.log('Producto eliminado con éxito');
        this.cargarProductos(); // Recarga la lista para reflejar el cambio
      },
      error: (e) => console.error('Error al eliminar producto', e),
    });
  }
}
