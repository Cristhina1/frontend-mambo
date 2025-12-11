import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

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
  modalInstance: any = null;

  constructor(private clienteService: ClienteService) {}

  userForm = new FormGroup({
    id: new FormControl(0),
    nombreCompleto: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    telefono: new FormControl(''),
    contra: new FormControl('')
  });

  filtroForm = new FormGroup({
    buscar: new FormControl(''),
    tipoDocumento: new FormControl('')
  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  get clientesFiltrados(): Cliente[] {
    const { buscar, tipoDocumento } = this.filtroForm.value;
    const b = (buscar || '').toLowerCase();

    return this.clientes.filter(c => {
      const matchBuscar = !b ||
                          c.nombreCompleto.toLowerCase().includes(b) ||
                          c.numeroDocumento.includes(b);
      const matchTipo = !tipoDocumento || c.tipoDocumento === tipoDocumento;
      return matchBuscar && matchTipo;
    });
  }

  // ⚠️ AQUÍ ESTÁ LA CLAVE PARA QUE FUNCIONE CON TU SERVICIO
  guardarCliente() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValues = this.userForm.getRawValue();

    // 1. Crear el FormData
    const formData = new FormData();

    // 2. Llenar los campos (Asegurando que no vayan null)
    formData.append('nombreCompleto', formValues.nombreCompleto || '');
    formData.append('tipoDocumento', formValues.tipoDocumento || '');
    formData.append('numeroDocumento', formValues.numeroDocumento || '');
    formData.append('email', formValues.email || '');
    formData.append('telefono', formValues.telefono || '');
    formData.append('contra', formValues.contra || '');

    // Si tu backend necesita el ID dentro del body también:
    if (formValues.id) {
       formData.append('id', formValues.id.toString());
    }

    // 3. Enviar al servicio (que espera FormData)
    if (this.editando) {
      const idCliente = formValues.id || 0;
      this.clienteService.updateCliente(idCliente, formData).subscribe({
        next: () => {
          this.postGuardado('Cliente actualizado correctamente');
        },
        error: (err) => alert('Error al actualizar: ' + err.message)
      });
    } else {
      this.clienteService.createCliente(formData).subscribe({
        next: () => {
          this.postGuardado('Cliente creado correctamente');
        },
        error: (err) => alert('Error al crear: ' + err.message)
      });
    }
  }

  postGuardado(mensaje: string) {
    alert(mensaje);
    this.cargarClientes();
    this.cerrarModal();
    this.resetForm();
  }

  nuevoCliente() {
    this.resetForm();
    this.abrirModal();
  }

  editarCliente(cliente: Cliente) {
    this.editando = true;
    console.log("Cliente a editar:", cliente); // Para verificar en consola que llegue el ID

    // 1. Cargamos los datos visuales
    this.userForm.patchValue(cliente);

    // 2. ⚠️ FORZAMOS LA ASIGNACIÓN DEL ID (Esto es lo que faltaba)
    // Asegúrate de que tu interfaz Cliente tenga el campo 'id'
this.userForm.controls['id'].setValue(cliente.id || 0);

    // Limpiamos la contraseña para que no se envíe la encriptada
    this.userForm.controls['contra'].setValue('');

    this.abrirModal();
  }

  eliminarCliente(id: number) {
    if (confirm('¿Eliminar cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => this.cargarClientes(),
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  resetForm() {
    this.userForm.reset({
      id: 0,
      tipoDocumento: '',
      nombreCompleto: '',
      numeroDocumento: '',
      email: '',
      telefono: '',
      contra: ''
    });
    this.editando = false;
  }

  abrirModal() {
    const el = document.getElementById('modalCliente');
    if (el) {
      this.modalInstance = new bootstrap.Modal(el);
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    if (this.modalInstance) this.modalInstance.hide();
    else {
        const btn = document.getElementById('cerrarModalBtn');
        if(btn) btn.click();
    }
  }
}
