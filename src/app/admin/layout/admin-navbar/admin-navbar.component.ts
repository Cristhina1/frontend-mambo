import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from "jwt-decode";
@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent {
  isLoggedIn = false;
  constructor(
    private router: Router,
  ) {}

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
    this.router.navigate(['/login']);
  }

}
