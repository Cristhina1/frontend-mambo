import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.scss']
})
export class MetodoPagoComponent {

  model = {
    metodo: '',
    numeroTarjeta: '',
    fecha: '',
    cvv: ''
  };

  pagar() {
    console.log("Método de pago:", this.model);
  }

}
