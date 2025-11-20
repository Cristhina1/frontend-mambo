import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reporte.html',
  styleUrls: ['./reporte.scss']
})
export class ReporteComponent {
  tipoReporte = 'ventas';
  periodo = 'mes';
  fechaInicio = '';
  fechaFin = '';

  resumen = [
    { titulo: 'Ventas del Período', valor: 'S/ 15,670.00', icono: 'bi-cash-stack', bg: 'bg-primary' },
    { titulo: 'Transacciones', valor: '127', icono: 'bi-receipt', bg: 'bg-success' },
    { titulo: 'Ticket Promedio', valor: 'S/ 123.39', icono: 'bi-calculator', bg: 'bg-warning' },
    { titulo: 'Crecimiento', valor: '+15.2%', icono: 'bi-trending-up', bg: 'bg-info' },
  ];

  datos = [
    { fecha: '09/09/2025', doc: 'B001-123', cliente: 'Juan Pérez', vendedor: 'Carlos Mendoza', total: 'S/ 450.00' },
    { fecha: '09/09/2025', doc: 'F001-456', cliente: 'Empresa ABC S.A.C.', vendedor: 'María González', total: 'S/ 1,245.60' },
    { fecha: '08/09/2025', doc: 'B001-124', cliente: 'Ana Torres', vendedor: 'José Pérez', total: 'S/ 78.50' },
  ];

  generarReporte() {
    alert('Reporte generado correctamente ✅');
  }

  limpiarFiltros() {
    this.tipoReporte = 'ventas';
    this.periodo = 'mes';
    this.fechaInicio = '';
    this.fechaFin = '';
  }
}

