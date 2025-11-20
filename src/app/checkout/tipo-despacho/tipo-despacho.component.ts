import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo-despacho',
  standalone: true,
  templateUrl: './tipo-despacho.component.html',
  styleUrls: ['./tipo-despacho.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TipoDespachoComponent {

  @Output() siguiente = new EventEmitter<void>();   // 👈 NECESARIO

  model = {
    tipo: '',
    direccion: '',
    ciudad: '',
    referencia: '',
    fechaEntrega: ''
  };

  enviar() {
    console.log("Despacho seleccionado:", this.model);
  }

}
