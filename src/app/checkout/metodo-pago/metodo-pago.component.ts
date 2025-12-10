import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { PagoData } from '../../services/checkout-data.model';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.scss']
})
export class MetodoPagoComponent implements OnInit {

  model: PagoData = { metodo: 'tarjeta', numeroTarjeta: '', fecha: '', cvv: '' };
  loading = false;

  // --- VARIABLES NUEVAS PARA LA LÓGICA DE BOLETA ---
  compraRealizada = false; // Controla si mostramos el formulario o la boleta
  datosVenta: any = null;  // Aquí guardamos la respuesta del backend (ID compra, total, etc.)

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedData = this.checkoutService.getCurrentData().pago;
    if (savedData) { this.model = savedData; }
  }

  pagar(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.loading) return;

    // 1. Guardar estado local
    this.checkoutService.setPagoData(this.model);

    // 2. Activar carga
    this.loading = true;

    // 3. ENVIAR AL BACKEND
    this.checkoutService.procesarCompra().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Compra exitosa:', response);

        // A. Guardamos la respuesta para mostrarla en la boleta
        this.datosVenta = response;

        // B. Cambiamos la vista: Ocultamos form, mostramos boleta
        this.compraRealizada = true;

        // C. Limpiamos el carrito en memoria (la compra ya está segura en BD)
        this.checkoutService.clearData();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al comprar:', err);

        // Manejo de error
        const msg = err.error?.message || "Ocurrió un error inesperado";
        alert("⚠️ Error: " + msg);
      }
    });
  }

  imprimirBoleta() {
    window.print();
  }

  volverInicio() {
    this.router.navigate(['/lista-productos']);
  }
}
