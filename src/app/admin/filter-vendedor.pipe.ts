import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterVendedor', standalone: true })
export class FilterVendedorPipe implements PipeTransform {
  transform(vendedores: any[], filtro: string): any[] {
    if (!filtro) return vendedores;
    filtro = filtro.toLowerCase();
    return vendedores.filter(v =>
      v.nombreCompleto.toLowerCase().includes(filtro) ||
      v.email.toLowerCase().includes(filtro) ||
      v.numeroDocumento.includes(filtro) ||
      String(v.id).includes(filtro)
    );
  }
}
