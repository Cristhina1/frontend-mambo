import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProducto',
  standalone: true
})
export class FilterProductoPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(it =>
      it.nombre.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
