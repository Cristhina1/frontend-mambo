import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from '../models/carrito.model';

@Injectable({
  providedIn: 'root',
})

export class CompraService {
  private apiUrl = 'http://localhost:8080/api/compras';
  constructor(private http: HttpClient) {}

  lista(): Observable<Compra[]>{
    return this.http.get<Compra[]>(`${this.apiUrl}`);
  }
  guardarCompra(compra:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/carrito`, compra)
  }

  mostrarHistorial() :Observable<Compra[]>{
    return this.http.get<Compra[]>(`${this.apiUrl}/mis-compras`);
  }

  obtenerDetalleCompra(id:number): Observable<Compra>{
    return this.http.get<Compra>(`${this.apiUrl}/${id}`)
  }

  confirmarEntrega(idCompra: number, password: string) {
  return this.http.put(`${this.apiUrl}/${idCompra}/entregar`, { password });
}
}
