import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagenUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API_URL = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  private mapearProducto(api: any): Producto {
    return {
      id: api.id,
      nombre: api.title,
      categoria: api.category,
      precio: api.price,
      descripcion: api.description,
      imagenUrl: api.image,
      stock: Math.floor(Math.random() * 50) + 1 // FakeStore no trae stock → generado
    };
  }

  private mapearProductoInverso(producto: Producto): any {
    return {
      title: producto.nombre,
      price: producto.precio,
      description: producto.descripcion,
      category: producto.categoria,
      image: producto.imagenUrl
    };
  }


  // GET productos

  getProductos(): Observable<Producto[]> {
  return this.http.get<any[]>(this.API_URL).pipe(
    map(productosAPI =>
      productosAPI.map(api => this.mapearProducto(api))
    )
  );
}



  // POST producto

  addProducto(producto: Producto): Observable<Producto> {
    const prodAPI = this.mapearProductoInverso(producto);
    return this.http.post<any>(this.API_URL, prodAPI).pipe(
      map(res => this.mapearProducto(res))
    );
  }


  // DELETE producto

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
