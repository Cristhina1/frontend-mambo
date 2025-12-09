import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout'; 
import { PagoData } from '../../services/checkout-data.model'; 

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [ CommonModule, FormsModule, HttpClientModule ],
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.scss']
})
export class MetodoPagoComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/compras/carrito'; //colocar la URL correcta

  model: PagoData = { metodo: '', numeroTarjeta: '', fecha: '', cvv: '' };

  constructor(
    private checkoutService: CheckoutService,
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedData = this.checkoutService.getCurrentData().pago;
    if (savedData) { this.model = savedData; }
  }

  pagar(form: NgForm) {
    if (form.invalid) { form.control.markAllAsTouched(); return; }

    this.checkoutService.setPagoData(this.model); 

    const finalPayload = this.checkoutService.getFinalPayload(); 

    // 2. ENVIAR A DB
    this.http.post(this.apiUrl, finalPayload).subscribe({
      next: (response: any) => {
        this.checkoutService.clearData(); // Limpia la instancia tras el éxito
        this.router.navigate(['/confirmacion', response.orderId]);
      },
      error: (error) => {
        console.error('Error al guardar en DB:', error);
      }
    });
  }
}