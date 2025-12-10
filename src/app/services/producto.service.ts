import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Asegúrate de que esta URL coincida con tu @RequestMapping del Controller en Java
  private apiUrl = 'http://localhost:8080/lista/productos';

  constructor(private http: HttpClient) { }

  // GET: Obtener todos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProducto(data: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, data);
  }

  updateProducto(id: number, data: FormData): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, data);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
