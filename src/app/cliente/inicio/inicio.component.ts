import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { CarritoComponent } from '../carrito/carrito.component';
import { FormsModule } from "@angular/forms";

declare var bootstrap: any;

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, CarritoComponent, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InicioComponent implements OnInit {

  cart = signal<any[]>([]);
  cartItemCount = signal(0);


  isLoggedIn = signal(false);
  currentUser = signal<any>(null);


  constructor(private router: Router) {}


  ngOnInit(): void {
    this.checkLoginStatus(); // Revisa si hay token y usuario al iniciar
    this.loadCart();         // Carga el carrito al iniciar

  }


  private checkLoginStatus() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("usuario");

    if (token && userData) {
      this.currentUser.set(JSON.parse(userData));
      this.isLoggedIn.set(true);
    } else {
      this.isLoggedIn.set(false);
      this.currentUser.set(null);
    }
  }

  // Corresponde a la función de logout del script
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // Esto es lo que hacía el script con location.reload()
    window.location.reload();
    // Opción más "Angular": this.router.navigate(['/']); this.checkLoginStatus();
  }

  // Corresponde a la lógica de envío de login del script
  handleLoginSubmit(event: Event) {
    event.preventDefault(); // Evita el envío tradicional

    // 💡 Aquí iría la lógica REAL de autenticación al backend.

    // Simulación del script original:
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const bsModal = bootstrap.Modal.getInstance(modalElement);
      if (bsModal) {
          bsModal.hide();
      }
    }
    // Simular inicio de sesión (demo)
    alert('Sesión iniciada (demo): La lógica real debe ser implementada.');
  }


  private loadCart() {
    const storedCart = localStorage.getItem('mambo_cart_v1');
    const loadedCart = storedCart ? JSON.parse(storedCart) : [];
    this.cart.set(loadedCart);
    this.updateCartCount();
  }

  private updateCartCount() {
    const count = this.cart().reduce((sum, item) => sum + item.qty, 0);
    this.cartItemCount.set(count);
  }

  onFinalizePurchase() {
    alert('Función de finalizar compra (implementar lógica de backend)');
  }
}
