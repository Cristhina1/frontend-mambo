import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { PagoData } from '../../services/checkout-data.model';
declare let bootstrap: any;
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

    if (this.loading) return; // Evitar doble clic

    // 1. Guardar estado local
    this.checkoutService.setPagoData(this.model);

    // 2. Activar carga
    this.loading = true;

    // 3. LLAMAR AL SERVICIO QUE YA TIENE LA LÓGICA HTTP Y EL MAPEO
    this.checkoutService.procesarCompra().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Compra exitosa:', response);

        // A. Abrir el Modal de Éxito (El que tienes en tu HTML padre)
        const modalElement = document.getElementById('compraExitosa');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }

        // B. Limpiar datos del carrito
        this.checkoutService.clearData();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al comprar:', err);

        // Manejo de error de Stock (Mensaje del Backend)
        const msg = err.error?.message || "Ocurrió un error inesperado";
        alert("⚠️ Error: " + msg);
      }
    });
  }
}
