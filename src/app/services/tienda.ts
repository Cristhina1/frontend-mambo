import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  private API_URL = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/products`);
  }

  // Obtener un producto por ID
  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/products/${id}`);
  }

  // Obtener categorías
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/products/categories`);
  }

  // Obtener productos por categoría
  getProductosPorCategoria(cat: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/products/category/${cat}`);
  }
}
