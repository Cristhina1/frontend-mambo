import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexPlotOptions, ApexStroke, ApexResponsive, ApexLegend, ApexFill, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { CompraService } from '../../services/compra.service';

// 1. DEFINICIÓN ESTRICTA (Quitamos los '?' para evitar errores en el HTML)
export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  labels: string[];
  legend: ApexLegend;
  fill: ApexFill;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  colors: string[];
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  hoy = new Date();

  // Estado de carga
  loading = true;
  datosCargados = false; // Controla que el HTML no lea variables vacías

  kpis = {
    ventasHoy: 0,
    pedidosPendientes: 0,
    productosBajoStock: 0,
    totalClientes: 0
  };

  ultimasVentas: any[] = [];

  // 2. INICIALIZACIÓN POR DEFECTO (Para que TypeScript no se queje al inicio)
  // Creamos objetos vacíos base para evitar "undefined"
  public ventasChartOptions: Partial<ChartOptions> | any = {};
  public categoriasChartOptions: Partial<ChartOptions> | any = {};

  constructor(private compraService: CompraService) {}

  ngOnInit() {
    this.cargarDashboardReal();
    this.cargarUltimasVentas();
  }

  cargarUltimasVentas() {
    // Asegúrate de que este método exista en tu servicio (o usa obtenerHistorialCompras)
    this.compraService.lista().subscribe(data => {
      this.ultimasVentas = data.slice(0, 5);
    });
  }

  cargarDashboardReal() {
    this.loading = true;

    // Llamada al backend
    this.compraService.obtenerDataDashboard().subscribe({
      next: (data) => {
        this.kpis = {
          ventasHoy: data.ventasHoy || 0,
          pedidosPendientes: data.pedidosPendientes || 0,
          productosBajoStock: data.productosBajoStock || 0,
          totalClientes: data.totalClientes || 0
        };

        this.configurarGraficos(data);

        this.loading = false;
        this.datosCargados = true; // ¡Ahora sí mostramos los gráficos!
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  configurarGraficos(data: any) {

    // --- GRÁFICO 1: VENTAS (BARRAS) ---
    this.ventasChartOptions = {
      series: [{
        name: "Ventas (S/)",
        data: data.ventasSemana || [0, 0, 0, 0, 0, 0, 0]
      }],
      chart: { type: "bar", height: 300, toolbar: { show: false }, fontFamily: 'sans-serif' },
      xaxis: {
        categories: data.diasSemana || ['L', 'M', 'M', 'J', 'V', 'S', 'D']
      },
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: "50%", distributed: true }
      },
      colors: ["#111827"], // Color Mambo
      dataLabels: { enabled: false },
      fill: { opacity: 1 },
      legend: { show: false } // Ocultamos leyenda en barras
    };

    // --- GRÁFICO 2: CATEGORÍAS (DONA) ---
    const catLabels = Object.keys(data.productosPorCategoria || {});
    const catSeries = Object.values(data.productosPorCategoria || {}) as number[];

    this.categoriasChartOptions = {
      series: catSeries.length ? catSeries : [1],
      labels: catLabels.length ? catLabels : ['Sin datos'],
      chart: { type: "donut", height: 280, fontFamily: 'sans-serif' },
      colors: ["#111827", "#ffcc00", "#e5e7eb", "#4b5563"],
      legend: {
        position: "bottom",
        // 3. SOLUCIÓN AL ERROR DE RADIUS:
        // Usamos 'any' en markers para evitar el error de tipado estricto
        markers: {
          radius: 12
        } as any
      },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: { show: true, name: { show: true }, value: { show: true } }
          }
        }
      }
    };
  }
}
