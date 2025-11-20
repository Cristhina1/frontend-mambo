import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],  // Asegúrate que este archivo existe
  imports: [ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {

  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      email: [''],
      telefono: [''],
      contra: ['', Validators.required],
      estado: ['Activo']
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Formulario:', this.form.value);
    alert('Registro exitoso');
    this.router.navigate(['/login']);
  }
}
