import { Component, OnInit } from '@angular/core'; // 1. Importar OnInit
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink, CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent implements OnInit { // 2. Implementar OnInit

  isLoggedIn = false;
  role: string = ''; // 3. DEFINIR LA VARIABLE QUE FALTABA

  constructor(private router: Router) {}

  ngOnInit() {
    // 4. Llamar a la función al cargar el componente
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

          // 5. EXTRAER EL ROL DEL TOKEN
          // (Ajustamos para quitar el prefijo "ROLE_" si viene así, ej: ROLE_ADMIN -> ADMIN)
          const rawRole = decodedToken.role || decodedToken.authorities || '';
          this.role = rawRole.replace('ROLE_', '');

          console.log("Rol en Navbar:", this.role); // Para depurar
        }

      } catch (error) {
        console.error("Token inválido", error);
        this.logout();
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.role = ''; // Limpiar rol
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
