import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';


@Component({
  selector: 'app-historial-compra',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, ],
  templateUrl: './historial-compra.component.html',
  styleUrl: './historial-compra.component.scss'
})
export class HistorialCompraComponent {

  compras: any[] = [];

  constructor() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const data = localStorage.getItem("historialCompras");
    this.compras = data ? JSON.parse(data) : [];
  }
}
