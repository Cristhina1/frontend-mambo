import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service'; // ← CORREGIDO

declare var bootstrap: any;

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  editando = false;

  constructor(private clienteService: ClienteService) {} // ← CORREGIDO

  userForm = new FormGroup({
    id: new FormControl(0),
    nombreCompleto: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    telefono: new FormControl(''),
    contra: new FormControl(''),
    estado: new FormControl('Activo'),
  });

  filtroForm = new FormGroup({
    buscar: new FormControl(''),
    tipoDocumento: new FormControl(''),
    estado: new FormControl(''),
  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  get clientesFiltrados(): Cliente[] {
    const { buscar, tipoDocumento, estado } = this.filtroForm.value;
    const b = buscar?.toLowerCase() || '';

    return this.clientes.filter(c =>
      (!buscar || c.nombreCompleto.toLowerCase().includes(b) || c.numeroDocumento.includes(b)) &&
      (!tipoDocumento || c.tipoDocumento === tipoDocumento) &&
      (!estado || c.estado === estado)
    );
  }

  guardarCliente() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const cliente = this.userForm.value as Cliente;

    if (this.editando) {
      this.clienteService.updateCliente(cliente.id!, cliente).subscribe({
        next: () => {
          this.cargarClientes();
          this.cerrarModal();
          this.resetForm();
        }
      });
    } else {
      this.clienteService.addCliente(cliente).subscribe({
        next: () => {
          this.cargarClientes();
          this.cerrarModal();
          this.resetForm();
        }
      });
    }
  }

  editarCliente(cliente: Cliente) {
    this.editando = true;
    this.userForm.patchValue(cliente);
    this.abrirModal();
  }

  eliminarCliente(id: number) {
    if (confirm('¿Deseas eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe(() => this.cargarClientes());
    }
  }

  resetForm() {
    this.userForm.reset({
      id: 0,
      estado: 'Activo'
    });
    this.editando = false;
  }

  abrirModal() {
    const modal = document.getElementById('modalCliente');
    if (modal) new bootstrap.Modal(modal).show();
  }

  cerrarModal() {
    const btn = document.getElementById('cerrarModalBtn') as HTMLButtonElement;
    btn?.click();
  }
}
