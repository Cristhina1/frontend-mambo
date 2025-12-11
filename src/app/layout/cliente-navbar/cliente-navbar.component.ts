import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../models/carrito.model';
import { CarritoComponent } from '../../cliente/carrito/carrito.component';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-cliente-navbar',
    standalone: true,
  imports: [CommonModule, RouterModule,CarritoComponent],
  templateUrl: './cliente-navbar.component.html',
  styleUrl: './cliente-navbar.component.scss',
})
export class ClienteNavbarComponent {

  isLoggedIn = false;
  userName: string | null = null;
  carritoItems: ItemCarrito[] = [];
  constructor(public carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.carritoItems = items;
    });
    this.checkLoginStatus();
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
          this.userName = decodedToken.name || decodedToken.sub || decodedToken.nombre || 'Usuario';
        }

      } catch (error) {
        console.error("Token inválido", error);
        this.logout();
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.userName = null;
  }

  login(name: string) {
    this.isLoggedIn = true;
    this.userName = name;
  }
}
