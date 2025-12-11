import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FilterProductoPipe } from '../filter-producto.pipe';
import { CompraService } from '../../services/compra.service';
import { ProductoService } from '../../services/producto.service';

interface ItemVenta {
  id: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
  stockMaximo: number;
}

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterProductoPipe],
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.scss']
})
export class BoletaComponent implements OnInit {

  // Datos del formulario
  boleta = {
    tipoDocumento: 'dni',
    numDocumento: '',
    nombreCliente: '',
    email: '',
    metodoPago: '',
    montoRecibido: 0,
    observaciones: ''
  };

  productos: ItemVenta[] = [];
  disponibles: any[] = [];
  buscarRapido = '';
  modalAbierto = false;

  constructor(
    private compraService: CompraService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: any[]) => {
        this.disponibles = data.map(p => ({
          id: p.id,
          codigo: p.codigo || 'COD-' + p.id,
          nombre: p.nombre,
          precio: p.precio,
          stock: p.stock
        }));
      },
      error: (err) => console.error("Error cargando productos", err)
    });
  }

  // --- GETTERS ---
  get subtotal(): number {
    return this.productos.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
  }
  get total(): number { return this.subtotal; }
  get igv(): number { return +(this.total - (this.total / 1.18)).toFixed(2); }
  get vuelto(): number {
    if (this.boleta.metodoPago !== 'efectivo') return 0;
    return +(this.boleta.montoRecibido - this.total).toFixed(2);
  }

  // --- MODAL Y TABLA ---
  abrirModal() {
    this.modalAbierto = true;
    this.buscarRapido = '';
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  seleccionarProducto(p: any) {
    if (p.stock <= 0) {
      alert("⚠️ Producto sin stock");
      return;
    }
    const existente = this.productos.find(item => item.id === p.id);

    if (existente) {
      if (existente.cantidad < existente.stockMaximo) {
        existente.cantidad++;
      } else {
        alert("Stock máximo alcanzado.");
      }
    } else {
      this.productos.push({
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre,
        precio: p.precio,
        cantidad: 1,
        stockMaximo: p.stock
      });
    }
    // Opcional: this.cerrarModal();
  }

  incrementarCantidad(index: number) {
    const item = this.productos[index];
    if (item.cantidad < item.stockMaximo) item.cantidad++;
    else alert("No hay más stock disponible.");
  }

  disminuirCantidad(index: number) {
    const item = this.productos[index];
    if (item.cantidad > 1) item.cantidad--;
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
  }

  limpiarFormulario() {
    this.productos = [];
    this.boleta = {
      tipoDocumento: 'dni', numDocumento: '', nombreCliente: '',
      metodoPago: 'efectivo', montoRecibido: 0, observaciones: '', email: '',
    };
  }

  // =========================================================
  // 🚀 AQUÍ ESTÁ LA LÓGICA DE GUARDADO CORREGIDA
  // =========================================================
  generarBoleta() {
    // 1. Validaciones básicas
    if (this.productos.length === 0) {
      alert("⚠️ El carrito está vacío.");
      return;
    }

    if (this.boleta.metodoPago === 'efectivo' && this.boleta.montoRecibido < this.total) {
      alert("⚠️ El monto recibido es insuficiente.");
      return;
    }

    const ventaRequest = {
      envio: {
        tipoEnvio: 'RECOJO_TIENDA',
        direccionEnvio: 'Tienda Principal - Venta Mostrador',
        ciudad: 'Lima',
        referencia: this.boleta.observaciones || 'Venta Presencial'
      },
      destinatario: {
        numeroDocumento: this.boleta.numDocumento,
        nombreCompleto: this.boleta.nombreCliente || 'Cliente General',
        apellidos: '-',
        telefono: '000000000',
        email: this.boleta.email || 'sin_correo@cliente.com',
      },
      pago: {
        tipoPago: this.mapearPago(this.boleta.metodoPago)
      },
      // Lógica: Si seleccionó RUC es FACTURA, sino BOLETA
      tipoComprobante: this.boleta.tipoDocumento === 'ruc' ? 'FACTURA' : 'BOLETA',
      detalles: this.productos.map(p => ({
        productoId: p.id,
        cantidad: p.cantidad
      }))
    };

    console.log("🚀 Enviando al Backend:", ventaRequest);


    this.compraService.guardarCompra(ventaRequest).subscribe({
      next: (res) => {
        // Asumiendo que el backend devuelve la venta creada o un mensaje
        alert(`✅ ¡Venta registrada con éxito!\nTotal: S/ ${this.total}`);
        this.limpiarFormulario();
        this.cargarProductos(); // Recargar stock actualizado
      },
      error: (err) => {
        console.error(err);
        // Intentar sacar el mensaje de error del backend si existe
        const mensajeError = err.error?.message || err.message || "Error desconocido";
        alert("❌ Error al guardar la venta: " + mensajeError);
      }
    });
  }

  // Helper para convertir el valor del select ('tarjeta') al Enum del Backend ('TARJETA')
  mapearPago(tipo: string): string {
    switch (tipo) {
      case 'tarjeta': return 'TARJETA';
      case 'transferencia': return 'YAPE'; // O 'TRANSFERENCIA' según tu Java Enum
      case 'mixto': return 'MIXTO';
      default: return 'EFECTIVO';
    }
  }
}
