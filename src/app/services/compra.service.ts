import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CompraService {
  private apiUrl = 'http://localhost:8080/api/compras/carrito';
  constructor(private http: HttpClient) {}
  guardarCompra(compra:any): Observable<any>{
    return this.http.post(this.apiUrl, compra)
  }
}
