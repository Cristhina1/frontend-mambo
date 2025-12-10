import { AuthService } from './../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../auth/login';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: any;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.form = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }
  
  get dni() {
    return this.form.get('dni');
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: Login = {
      dni: this.dni.value,
      password: this.password.value,
    };

    console.log('🚀 Enviando login...', request);

    this.authService.login(request).subscribe({
      next: (res) => {
        console.log('✔️ Login exitoso', res);

        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error('❌ Error en login', err);
        alert('DNI o contraseña incorrectos');
      },
    });
  }
}
