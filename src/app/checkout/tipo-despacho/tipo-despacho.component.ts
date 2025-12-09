import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CheckoutService } from '../../services/checkout'; 
import { DespachoData } from '../../services/checkout-data.model'; 

@Component({
  selector: 'app-tipo-despacho',
  standalone: true,
  templateUrl: './tipo-despacho.component.html',
  styleUrls: ['./tipo-despacho.component.scss'],
  imports: [ CommonModule, FormsModule ]
})
export class TipoDespachoComponent implements OnInit { 

  @Output() nextStep = new EventEmitter<void>();
  model: DespachoData = { tipo: '', direccion: '', ciudad: '', referencia: '', fechaEntrega: '' };

  constructor(private checkoutService: CheckoutService) {} //INYECTADO

  ngOnInit(): void {
    const savedData = this.checkoutService.getCurrentData().despacho;
    if (savedData) { this.model = savedData; }
  }

  enviar(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.checkoutService.setDespachoData(this.model); //GUARDADO TEMPORAL
    console.log("Despacho guardado temporalmente:", this.model);
    this.nextStep.emit();
  }
}