import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/carrito.model';
declare let bootstrap: any;

@Component({
  selector: 'app-historial-compra',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, ],
  templateUrl: './historial-compra.component.html',
  styleUrl: './historial-compra.component.scss'
})
export class HistorialCompraComponent implements OnInit {

  misCompras: Compra[] = [];
  compraSeleccionada: any = null;
  loading: boolean = true;
  errorMensaje: string = '';

  constructor(private compraService: CompraService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.loading = true;
    this.compraService.mostrarHistorial().subscribe({
      next: (data) => {
        this.misCompras = data;
        this.loading = false;
        console.log("Historial cargado:", data);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error al cargar historial", err);
        this.loading = false;
        // Aquí podrías mostrar un mensaje si no hay compras o si falló el token
      }
    });
  }

  verDetalle(id:number){
    this.compraService.obtenerDetalleCompra(id).subscribe({
      next: (data) => {
        this.compraSeleccionada = data;

        // Abrir el modal manualmente una vez que tenemos los datos
        const modalElement = document.getElementById('modalDetalle');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (err) => console.error("Error al cargar detalle", err)
    })
  }
}
