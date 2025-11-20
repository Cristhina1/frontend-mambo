import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Item {
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './boleta.html',
  styleUrls: ['./boleta.scss']
})
export class BoletaComponent {
  // Cliente
  boleta = {
    tipoDocumento: 'dni',
    numDocumento: '',
    nombreCliente: '',
    metodoPago: 'efectivo',
    montoRecibido: 0,
    observaciones: ''
  };

  // Producto temporal
  producto: Item = { codigo: '', nombre: '', cantidad: 1, precio: 0 };
  productos: Item[] = [];

  // Productos disponibles (mock)
  disponibles: Item[] = [
    { codigo: 'R001', nombre: 'Camiseta Hombre', cantidad: 1, precio: 49.9 },
    { codigo: 'R002', nombre: 'Pantalón Mujer', cantidad: 1, precio: 89.5 },
    { codigo: 'R003', nombre: 'Chaqueta Unisex', cantidad: 1, precio: 129.9 }
  ];

  buscarRapido = '';

  // Calculos
  get subtotal(): number {
    return this.productos.reduce((s, p) => s + p.cantidad * p.precio, 0);
  }
  get igv(): number {
    return +(this.subtotal * 0.18).toFixed(2);
  }
  get total(): number {
    return +(this.subtotal + this.igv).toFixed(2);
  }
  get vuelto(): number {
    return +(this.boleta.montoRecibido - this.total).toFixed(2);
  }

  // Métodos
  agregarProducto() {
    if (!this.producto.codigo || this.producto.cantidad <= 0 || this.producto.precio <= 0) return;

    const idx = this.productos.findIndex(p => p.codigo === this.producto.codigo);
    if (idx >= 0) {
      this.productos[idx].cantidad += this.producto.cantidad;
    } else {
      this.productos.push({ ...this.producto });
    }
    this.producto = { codigo: '', nombre: '', cantidad: 1, precio: 0 };
  }

  eliminarProducto(i: number) {
    this.productos.splice(i, 1);
  }

  limpiarFormulario() {
    this.boleta = { tipoDocumento: 'dni', numDocumento: '', nombreCliente: '', metodoPago: 'efectivo', montoRecibido: 0, observaciones: '' };
    this.productos = [];
    this.producto = { codigo: '', nombre: '', cantidad: 1, precio: 0 };
  }

  seleccionarProducto(codigo: string, nombre: string, precio: number) {
    this.producto = { codigo, nombre, cantidad: 1, precio };
  }

  generarBoleta() {
    alert(`✅ Boleta generada correctamente\nTotal: S/ ${this.total.toFixed(2)}`);
    this.limpiarFormulario();
  }

  verPreview() {
    const resumen = this.productos.map(p => `${p.cantidad}x ${p.nombre} = S/ ${(p.cantidad * p.precio).toFixed(2)}`).join('\n');
    alert(`Vista Previa:\nCliente: ${this.boleta.nombreCliente}\n${resumen}\nTotal: S/ ${this.total.toFixed(2)}`);
  }

  guardarBorrador() {
    alert('💾 Borrador guardado (simulado)');
  }
}
