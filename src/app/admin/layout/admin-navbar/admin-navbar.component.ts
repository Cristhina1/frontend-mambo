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
  logout(): void {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      // Aquí tu lógica para cerrar sesión
      this.router.navigate(['/login']);
    }
  }

}
