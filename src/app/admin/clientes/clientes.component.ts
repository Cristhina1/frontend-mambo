import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

interface Cliente {
  id: number;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
  contra: string;
  estado: 'Activo' | 'Inactivo';
}



@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.scss']
})

export class ClientesComponent {

  userForm = new FormGroup({
    id: new FormControl(0),
    nombreCompleto: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', Validators.required),
    contra: new FormControl(''),
    estado: new FormControl('Activo'),
  })

  editando = false;

  clientes: Cliente[] = [
    { id: 1, nombreCompleto: 'Juan Pérez', tipoDocumento: 'DNI', numeroDocumento: '12345678', email: 'juan@gmail.com', telefono: '987654321',contra:'123', estado: 'Activo' },
    { id: 2, nombreCompleto: 'María Gómez', tipoDocumento: 'RUC', numeroDocumento: '20452369874', email: 'maria@empresa.com', telefono: '998877665',contra:'423', estado: 'Inactivo' }
  ];

  // filtros
  buscar = '';
  filtroTipo = '';
  filtroEstado = '';

  filtroForm = new FormGroup({
  buscar: new FormControl(''),
  tipoDocumento: new FormControl(''),
  estado: new FormControl(''),
  });


  // filtrar resultados
  get clientesFiltrados(): Cliente[] {
    const { buscar, tipoDocumento, estado } = this.filtroForm.value;
    return this.clientes.filter(c => {
      const matchBuscar = !buscar || c.nombreCompleto.toLowerCase().includes(buscar.toLowerCase()) || c.numeroDocumento.includes(buscar);
    const matchTipo = !tipoDocumento || c.tipoDocumento === tipoDocumento;
    const matchEstado = !estado || c.estado === estado;
      return matchBuscar && matchTipo && matchEstado;
    });
  }

  guardarCliente() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const cliente = this.userForm.value as Cliente;

    if (this.editando) {
      const idx = this.clientes.findIndex(c => c.id === cliente.id);
      if (idx >= 0) this.clientes[idx] = cliente;
    } else {
      cliente.id = Math.max(...this.clientes.map(c => c.id), 0) + 1;
      this.clientes.push(cliente);
    }
    console.log(this.userForm.value);
    this.cerrarModal();
    this.resetForm();

  }


  editarCliente(c: Cliente) {
    this.editando = true;
    this.userForm.patchValue(c)
    this.abrirModal();
  }

  eliminarCliente(id: number) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clientes = this.clientes.filter(c => c.id !== id);
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
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }

  cerrarModal() {
    const btn = document.getElementById('cerrarModalBtn') as HTMLButtonElement;
    btn?.click();
  }

}
