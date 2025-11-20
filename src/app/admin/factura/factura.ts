import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura.html',
  styleUrls: ['./factura.scss']
})
export class FacturaComponent {
  productos: any[] = [];
  codigoProducto = '';
  descripcion = '';
  cantidad = 1;
  precio = 0;
  subtotal = 0;
  igv = 0;
  total = 0;

  // Cliente
  rucCliente = '';
  razonSocial = '';
  direccionCliente = '';

  agregarProducto() {
    if (!this.descripcion.trim() || this.cantidad <= 0 || this.precio <= 0) return;

    const producto = {
      codigo: this.codigoProducto || 'N/A',
      descripcion: this.descripcion,
      cantidad: this.cantidad,
      precio: this.precio,
      valorVenta: this.cantidad * this.precio,
      igv: this.cantidad * this.precio * 0.18,
      total: this.cantidad * this.precio * 1.18
    };

    this.productos.push(producto);
    this.calcularTotales();
    this.limpiarCamposProducto();
  }

  limpiarCamposProducto() {
    this.codigoProducto = '';
    this.descripcion = '';
    this.cantidad = 1;
    this.precio = 0;
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    this.calcularTotales();
  }

  calcularTotales() {
    this.subtotal = this.productos.reduce((acc, p) => acc + p.valorVenta, 0);
    this.igv = this.subtotal * 0.18;
    this.total = this.subtotal + this.igv;
  }

  limpiarFormulario() {
    this.productos = [];
    this.rucCliente = '';
    this.razonSocial = '';
    this.direccionCliente = '';
    this.subtotal = this.igv = this.total = 0;
  }

  generarFactura() {
    alert('✅ Factura generada correctamente');
  }

  enviarSunat() {
    alert('📤 Enviando a SUNAT...');
  }

  descargarPDF() {
    alert('💾 Descargando PDF...');
  }

  guardarBorradorFactura() {
    alert('📝 Borrador guardado');
  }
}
