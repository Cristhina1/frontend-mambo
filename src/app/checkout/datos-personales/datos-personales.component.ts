import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { PersonalData } from '../../services/checkout-data.model';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

  model: PersonalData = { nombres: '', apellidos: '', email: '', telefono: '' };
  @Output() nextStep = new EventEmitter<void>();

  constructor(private checkoutService: CheckoutService) {} //INYECTADO

  ngOnInit(): void {
    const savedData = this.checkoutService.getCurrentData().personal;
    if (savedData && (savedData.nombres || savedData.email)) {
      this.model = { ...savedData };
    }
  }

  enviar(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.checkoutService.setPersonalData(this.model);
    console.log('Datos guardados en instancia temporal:', this.model);
    this.nextStep.emit();
  }
}
