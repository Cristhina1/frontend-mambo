import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // mock data (reemplaza por llamadas cuando tengas backend)
  ventasDelDia = 'S/ 2,450.00';
  ventasDelMes = 'S/ 15,670.00';
  cantClientes = 127;
  cantProductos = 89;

  // actividad reciente mock
  actividad = [
    { titulo: 'Factura #001234 generada', descripcion: 'Cliente: Juan Pérez - Monto: S/ 450.00', tiempo: 'Hace 15 minutos', tipo: 'success' },
    { titulo: 'Nuevo cliente registrado', descripcion: 'María González - RUC: 20123456789', tiempo: 'Hace 1 hora', tipo: 'primary' },
    { titulo: 'Stock bajo en productos', descripcion: '5 productos requieren reposición', tiempo: 'Hace 2 horas', tipo: 'warning' }
  ];

  // alertas mock
  alertas = [
    { tipo: 'warning', texto: 'Stock Bajo: 5 productos necesitan reposición.' },
    { tipo: 'info', texto: 'Recordatorio: Generar reporte mensual.' }
  ];

  // reloj para reemplazar fechaActualHeader.js
  ahora = new Date();

  ngOnInit(): void {
    setInterval(() => this.ahora = new Date(), 1000);
  }
}
