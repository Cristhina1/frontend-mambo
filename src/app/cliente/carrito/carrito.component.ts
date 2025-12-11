import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../models/carrito.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.scss']
})

export class CarritoComponent {
  isLoggedIn = false;
  carrito: ItemCarrito[] = [];
  carritoAbierto: boolean = false;

  constructor(public carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
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
  checkLoginStatus() {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const isExpired = decodedToken.exp < (Date.now() / 1000);
          if (isExpired) {
            this.logout();
          } else {
            this.isLoggedIn = true;
          }

        } catch (error) {
          console.error("Token inválido", error);
          this.logout();
        }
      }
    }
      logout() {
    this.isLoggedIn = false;
    localStorage.clear();
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
