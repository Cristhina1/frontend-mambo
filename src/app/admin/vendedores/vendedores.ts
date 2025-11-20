import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterVendedorPipe } from '../filter-vendedor.pipe';

@Component({
  selector: 'app-vendedores',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterVendedorPipe],
  templateUrl: './vendedores.html',
  styleUrls: ['./vendedores.scss']
})
export class VendedoresComponent {
  filtro = '';
  vendedores = [
    { id: 1, nombreCompleto: 'Juan Pérez', numeroDocumento: '12345678', email: 'juan@mail.com', telefono: '987654321', contra: '' },
    { id: 2, nombreCompleto: 'Ana Torres', numeroDocumento: '87654321', email: 'ana@mail.com', telefono: '999888777', contra: '' },
  ];

  vendedorActual = this.limpiar();

  nuevoVendedor() {
    this.vendedorActual = this.limpiar();
  }

  editarVendedor(v: any) {
    this.vendedorActual = { ...v };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalVendedor'));
    modal.show();
  }

  guardarVendedor() {
    if (this.vendedorActual.id) {
      const i = this.vendedores.findIndex(x => x.id === this.vendedorActual.id);
      if (i !== -1) this.vendedores[i] = { ...this.vendedorActual };
    } else {
      const nuevoId = Math.max(...this.vendedores.map(x => x.id), 0) + 1;
      this.vendedores.push({ ...this.vendedorActual, id: nuevoId });
    }
    this.cerrarModal();
  }

  eliminarVendedor(id: number) {
    this.vendedores = this.vendedores.filter(v => v.id !== id);
  }

  limpiar() {
    return { id: 0, nombreCompleto: '', numeroDocumento: '', email: '', telefono: '', contra: '' };
  }

  cerrarModal() {
    const modalEl = document.getElementById('modalVendedor');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

