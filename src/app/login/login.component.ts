import { AuthService } from './../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../auth/login';
import { jwtDecode } from "jwt-decode"; // <--- IMPORTANTE

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Asegúrate de que el archivo se llame así
})
export class LoginComponent implements OnInit {

  form: any;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  get numeroDocumento() { return this.form.get('numeroDocumento'); }
  get password() { return this.form.get('password'); }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: Login = {
      numeroDocumento: this.numeroDocumento.value,
      password: this.password.value,
    };

    console.log('🚀 Enviando login...', request);

    this.authService.login(request).subscribe({
      next: (res) => {
        console.log('✔️ Login exitoso', res);
        this.loading = false;

        if (res.token) {
          localStorage.setItem('token', res.token);

          // --- LÓGICA DE REDIRECCIÓN CORREGIDA ---
          try {
            const decodedToken: any = jwtDecode(res.token);

            // Obtenemos el rol. Java lo envía como string ej: "ROLE_VENDEDOR"
            // Si por alguna razón es un array, tomamos el primero.
            const rawRole = decodedToken.role || decodedToken.authorities;
            const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;

            console.log("Rol final detectado:", role);

            // 1. CASO ADMINISTRADOR O VENDEDOR -> Dashboard
            if (role === 'ROLE_ADMIN' || role === 'ROLE_VENDEDOR') {
              console.log('Redirigiendo al Dashboard...');
              this.router.navigate(['/admin/productos']);
            }
            // 2. CUALQUIER OTRO CASO (Cliente) -> Catálogo
            else {
              console.log('Redirigiendo a Productos...');
              this.router.navigate(['/productos']);
            }

          } catch (e) {
            console.warn("No se pudo leer el rol, redirigiendo a home.", e);
            this.router.navigate(['/productos']);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error en login', err);

        if (err.status === 403 || err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      },
    });
  }




}
