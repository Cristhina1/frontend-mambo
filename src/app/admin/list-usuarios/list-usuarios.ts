import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-usuarios.html',
  styleUrls: ['./list-usuarios.scss']
})
export class ListUsuariosComponent {
  filtroNombre = '';
  filtroEstado = '';
  filtroTurno = '';

  estadisticas = [
    { titulo: 'Total Vendedores', valor: 8, bg: 'bg-dark', icono: 'bi bi-people' },
    { titulo: 'Activos', valor: 7, bg: 'bg-success', icono: 'bi bi-person-check' },
    { titulo: 'Ventas del Mes', valor: 'S/ 15,670', bg: 'bg-primary', icono: 'bi bi-graph-up' },
    { titulo: 'Promedio por Vendedor', valor: 'S/ 2,240', bg: 'bg-info', icono: 'bi bi-calculator' }
  ];

  vendedores = [
    { id: 'V001', nombre: 'Carlos Mendoza López', email: 'carlos@mambo.com', telefono: '987654321', turno: 'Mañana', ventas: 'S/ 3,450.00', estado: 'Activo' },
    { id: 'V002', nombre: 'María González', email: 'maria@mambo.com', telefono: '987654322', turno: 'Tarde', ventas: 'S/ 2,890.00', estado: 'Activo' },
    { id: 'V003', nombre: 'José Pérez', email: 'jose@mambo.com', telefono: '987654323', turno: 'Noche', ventas: 'S/ 1,780.00', estado: 'Activo' },
    { id: 'V004', nombre: 'Ana Torres', email: 'ana@mambo.com', telefono: '987654324', turno: 'Mañana', ventas: 'S/ 2,345.00', estado: 'Inactivo' },
  ];

  vendedoresFiltrados = [...this.vendedores];

  filtrarVendedores() {
    this.vendedoresFiltrados = this.vendedores.filter(v =>
      v.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
      (this.filtroEstado ? v.estado === this.filtroEstado : true) &&
      (this.filtroTurno ? v.turno === this.filtroTurno : true)
    );
  }
}
