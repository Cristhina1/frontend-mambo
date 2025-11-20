import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PasoHeaderComponent } from '../paso-header/paso-header.component';
import { DatosPersonalesComponent } from '../datos-personales/datos-personales.component';
import { TipoDespachoComponent } from '../tipo-despacho/tipo-despacho.component';
import { MetodoPagoComponent } from '../metodo-pago/metodo-pago.component';

@Component({
  selector: 'app-checkout-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PasoHeaderComponent,
    DatosPersonalesComponent,
    TipoDespachoComponent,
    MetodoPagoComponent
  ],
  templateUrl: './checkout-layout.component.html',
  styleUrls: ['./checkout-layout.component.scss']
})
export class CheckoutLayoutComponent {

  // Datos del proceso
  datosPersonales: any = {};
  despacho: any = {};
  pago: any = {};

  // Carrito
  carrito: any[] = [];
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.carrito = items;
      this.total = this.carritoService.calcularTotal();
    });
  }

  // --- Pasos del formulario ---
  recibirDatosPersonales(data: any) {
    this.datosPersonales = data;
    this.pasoActual = 2;
  }

  recibirDespacho(data: any) {
    this.despacho = data;
    this.pasoActual = 3;
  }

  recibirPago(data: any) {
    this.pago = data;
    this.abrirModal();
  }

  // --- Validación final ---
  get checkoutCompleto() {
    return (
      Object.keys(this.datosPersonales).length > 0 &&
      Object.keys(this.despacho).length > 0 &&
      Object.keys(this.pago).length > 0
    );
  }

  // --- Modal Bootstrap (sin importar bootstrap) ---
  abrirModal() {
    const modalElement = document.getElementById('compraExitosa');
    if (!modalElement) return;

    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  finalizarCompra() {
    this.abrirModal();
  }

  // --- Navegación ---
  goToProductos() {
    this.router.navigate(['/lista-productos']);
  }
  pasoActual = 1;

  cambiarPaso(paso: number) {
    this.pasoActual = paso;
  }
}
