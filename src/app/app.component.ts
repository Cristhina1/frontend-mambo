
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService  } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Sistema Facturación';
  constructor(public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      console.log("✅ El usuario sigue logueado (Token detectado)");
    } else {
      console.log("⚠️ No hay usuario logueado");
    }
  }
}
