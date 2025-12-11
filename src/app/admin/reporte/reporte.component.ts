import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Compra } from '../../models/carrito.model';
import { CompraService } from '../../services/compra.service';
declare let bootstrap: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.scss']
})
export class ReporteComponent {
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
      this.compraService.lista().subscribe({
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

    entregarPedido(compra: any) {
  Swal.fire({
    title: 'Confirmar Entrega',
    text: 'Ingrese su contraseña de usuario para validar:',
    input: 'password', // Input tipo contraseña
    inputAttributes: {
      autocapitalize: 'off',
      placeholder: 'Su contraseña aquí'
    },
    showCancelButton: true,
    confirmButtonText: 'Confirmar Entrega',
    confirmButtonColor: '#28a745', // Verde
    showLoaderOnConfirm: true,
    preConfirm: (password) => {
      // Retornamos la promesa del servicio
      return this.compraService.confirmarEntrega(compra.id, password).toPromise()
        .catch(error => {
          Swal.showValidationMessage(`❌ Error: ${error.error || 'Contraseña incorrecta'}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: '¡Entregado!',
        text: 'El estado de la compra ha sido actualizado.',
        icon: 'success'
      });
      this.cargarHistorial(); // Recargar tabla
    }
  });
}
}

