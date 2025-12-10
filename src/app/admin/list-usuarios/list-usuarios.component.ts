import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Vendedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  turno: string;
  ventas: number;
  estado: 'Activo' | 'Inactivo';

  // nuevos campos
  fechaIngreso: string;
  direccion: string;
}


interface EstadisticaCard {
  titulo: string;
  valor: string;
  icono: string;
  bg: string;
}

declare var bootstrap: any;

@Component({
  selector: 'app-list-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.scss'],
})
export class ListUsuariosComponent {
  // Filtros
  filtroNombre = '';
  filtroEstado = '';
  filtroTurno = '';

  // Datos de vendedores (mock en memoria)
 vendedores: Vendedor[] = [
  {
    id: 'V001',
    nombre: 'María López',
    email: 'maria@mambo.com',
    telefono: '987654321',
    turno: 'Mañana',
    ventas: 12500,
    estado: 'Activo',
    fechaIngreso: '2025-09-01',
    direccion: 'Av. Primavera 123, Lima',
  },
  {
    id: 'V002',
    nombre: 'Carlos Gómez',
    email: 'carlos@mambo.com',
    telefono: '956123456',
    turno: 'Tarde',
    ventas: 8940,
    estado: 'Activo',
    fechaIngreso: '2025-08-15',
    direccion: 'Jr. Los Olivos 456, Lima',
  },
  {
    id: 'V003',
    nombre: 'José Pérez',
    email: 'jose@mambo.com',
    telefono: '923456789',
    turno: 'Noche',
    ventas: 1780,
    estado: 'Activo',
    fechaIngreso: '2025-07-20',
    direccion: 'Av. Arequipa 789, Lima',
  },
  {
    id: 'V004',
    nombre: 'Ana Torres',
    email: 'ana@mambo.com',
    telefono: '912345678',
    turno: 'Mañana',
    ventas: 2345,
    estado: 'Inactivo',
    fechaIngreso: '2025-06-10',
    direccion: 'Calle Las Flores 321, Lima',
  },
];


  // Copia filtrada para la tabla
  vendedoresFiltrados: Vendedor[] = [];

  // Tarjetas de estadísticas
  estadisticas: EstadisticaCard[] = [];

  // Estado del modal / formulario
  nuevoVendedor: Vendedor = this.crearVendedorVacio();
  editando = false; // false = nuevo, true = editar

  constructor() {
    // Inicializar al cargar el componente
    this.vendedoresFiltrados = [...this.vendedores];
    this.actualizarEstadisticas();
  }

  // ==============================
  // Helpers
  // ==============================

 private crearVendedorVacio(): Vendedor {
  return {
    id: '',
    nombre: '',
    email: '',
    telefono: '',
    turno: '',
    ventas: 0,
    estado: 'Activo',
    fechaIngreso: '',
    direccion: '',
  };
}


  private actualizarEstadisticas(): void {
    const total = this.vendedores.length;
    const activos = this.vendedores.filter((v) => v.estado === 'Activo').length;
    const ventasTotales = this.vendedores.reduce(
      (acc, v) => acc + (v.ventas || 0),
      0
    );
    const promedio = total > 0 ? ventasTotales / total : 0;

    this.estadisticas = [
      {
        titulo: 'Total de Vendedores',
        valor: String(total),
        icono: 'bi bi-people-fill',
        bg: 'bg-dark',
      },
      {
        titulo: 'Activos',
        valor: String(activos),
        icono: 'bi bi-person-check',
        bg: 'bg-success',
      },
      {
        titulo: 'Ventas del Mes',
        valor: `S/ ${ventasTotales.toLocaleString('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icono: 'bi bi-graph-up-arrow',
        bg: 'bg-primary',
      },
      {
        titulo: 'Promedio por Vendedor',
        valor: `S/ ${promedio.toLocaleString('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icono: 'bi bi-bar-chart-line',
        bg: 'bg-info',
      },
    ];
  }

  // ==============================
  // Filtros
  // ==============================

  filtrarVendedores(): void {
    this.vendedoresFiltrados = this.vendedores.filter((v) => {
      const coincideNombre = v.nombre
        .toLowerCase()
        .includes(this.filtroNombre.toLowerCase());
      const coincideEstado = this.filtroEstado
        ? v.estado === this.filtroEstado
        : true;
      const coincideTurno = this.filtroTurno
        ? v.turno === this.filtroTurno
        : true;

      return coincideNombre && coincideEstado && coincideTurno;
    });
  }

  // ==============================
  // CRUD en memoria
  // ==============================

  abrirNuevoVendedor(): void {
    this.editando = false;
    this.nuevoVendedor = this.crearVendedorVacio();
  }

  abrirEdicionVendedor(vendedor: Vendedor): void {
    this.editando = true;
    // Clonar para no modificar directamente el objeto de la lista
    this.nuevoVendedor = { ...vendedor };
  }

 guardarVendedor(): void {
  // Validación simple
  if (!this.nuevoVendedor.nombre || !this.nuevoVendedor.email) {
    alert('Nombre y email son obligatorios.');
    return;
  }

  if (this.editando) {
    // UPDATE
    const index = this.vendedores.findIndex(
      (v) => v.id === this.nuevoVendedor.id
    );
    if (index !== -1) {
      this.vendedores[index] = { ...this.nuevoVendedor };
    }
  } else {
    // CREATE
    const siguienteNumero = this.vendedores.length + 1;
    const nuevoId =
      this.nuevoVendedor.id && this.nuevoVendedor.id.trim() !== ''
        ? this.nuevoVendedor.id
        : `V${siguienteNumero.toString().padStart(3, '0')}`;

    this.vendedores.push({
      ...this.nuevoVendedor,
      id: nuevoId,
    });
  }

  // Actualizar lista filtrada y estadísticas
  this.vendedoresFiltrados = [...this.vendedores];
  this.filtrarVendedores();
  this.actualizarEstadisticas();

  // ===== Cerrar modal manualmente =====
  const modalElement = document.getElementById('modalNuevoVendedor');
  if (modalElement) {
    const modalInstance =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement);
    modalInstance.hide();
  }
}



}
