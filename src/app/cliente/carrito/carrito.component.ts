import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../models/carrito.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.scss']
})

export class CarritoComponent {

  carrito: ItemCarrito[] = [];
  carritoAbierto: boolean = false;

  constructor(public carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.carrito = items;
    });
  }

  abrirCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  eliminar(index: number) {
    const id = this.carrito[index].id;
    this.carritoService.eliminarProducto(id);
  }

  getTotal() {
    return this.carritoService.calcularTotal();
  }

  onFinalizePurchase() {
    const offcanvasElement = document.getElementById('cartCanvas');

    if (offcanvasElement) {
      offcanvasElement.classList.remove('show');
      offcanvasElement.removeAttribute('aria-modal');
      offcanvasElement.setAttribute('aria-hidden', 'true');

      const backdrop = document.querySelector('.offcanvas-backdrop');
      backdrop?.remove();
    }

    document.body.style.overflow = 'auto';
    document.body.classList.remove('offcanvas-backdrop');
    document.body.classList.remove('modal-open');

    this.router.navigate(['/checkout/datos']);
  }
}
