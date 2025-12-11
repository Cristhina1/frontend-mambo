import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, Login, Register } from './login';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(request: Login) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: Register): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
    getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  }
  hasRole(rolesPermitidos: string[]): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const userRole = decoded.role;

    return rolesPermitidos.includes(userRole);

  } catch (e) {
    return false;
  }
}

}
