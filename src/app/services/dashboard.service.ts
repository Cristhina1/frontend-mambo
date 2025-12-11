import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DashboardService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}
obtenerDashboard(): Observable<any> {
  return this.http.get(`${this.apiUrl}/dashboard/resumen`); // Ajusta la URL base si es necesario
}
}
