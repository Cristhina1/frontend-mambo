import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paso-header',
  standalone: true,
  templateUrl: './paso-header.component.html',
  styleUrls: ['./paso-header.component.scss']
})
export class PasoHeaderComponent {

  @Input() paso!: number;
  @Output() onPasoSeleccionado = new EventEmitter<number>();

  seleccionarPaso(p: number) {
    this.onPasoSeleccionado.emit(p);
  }

}
