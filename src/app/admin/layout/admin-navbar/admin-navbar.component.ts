import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent {
  constructor(
    private router: Router,
  ) {}
  confirmarCerrarSesion() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('confirmLogoutModal'));
    modal.show();
  }

  cerrarSesion() {
    // Lógica para cerrar sesión
    // Ejemplo: this.authService.logout();

    // Redirigir al login
    this.router.navigate(['/login']);

    // Mostrar mensaje de éxito
    console.log('Sesión cerrada exitosamente');
  }

}
