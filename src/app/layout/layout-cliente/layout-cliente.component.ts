
import { Component } from '@angular/core';
import { ClienteNavbarComponent } from "../cliente-navbar/cliente-navbar.component";
import { RouterModule } from "@angular/router";
import { CarritoComponent } from "../../cliente/carrito/carrito.component";

@Component({
  selector: 'app-cliente-layout',
  imports: [ClienteNavbarComponent, RouterModule, CarritoComponent],
  templateUrl: './layout-cliente.component.html',
  styleUrl: './layout-cliente.scss',
})
export class ClienteLayout {

}
