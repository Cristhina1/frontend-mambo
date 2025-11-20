import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent {

  model = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: ''
  };

  enviar(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    console.log('Datos enviados:', this.model);
  }
}
