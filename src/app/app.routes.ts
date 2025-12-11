
import { Routes } from '@angular/router';
import { InicioComponent } from './cliente/inicio/inicio.component';
import { ListaProductosComponent } from './cliente/lista-productos/lista-productos.component';
import { HistorialCompraComponent } from './cliente/historial-compra/historial-compra.component';
import { ContactanosComponent} from './cliente/contactanos/contactanos.component';
import { CheckoutLayoutComponent } from './checkout/checkout-layout/checkout-layout.component';
import { DatosPersonalesComponent } from './checkout/datos-personales/datos-personales.component';
import { TipoDespachoComponent } from './checkout/tipo-despacho/tipo-despacho.component';
import { MetodoPagoComponent } from './checkout/metodo-pago/metodo-pago.component';


import { HomeComponent } from './admin/home/home.component';
import { BoletaComponent } from './admin/boleta/boleta.component';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { ListUsuariosComponent } from './admin/list-usuarios/list-usuarios.component';
import { ProductosComponent } from './admin/productos/productos.component';
import { ReporteComponent } from './admin/reporte/reporte.component';
import { VendedoresComponent } from './admin/vendedores/vendedores.component';
import { ClienteLayout } from './layout/layout-cliente/layout-cliente.component';
import { AdminLayoutComponent } from './admin/layout/layout-admin/layout-admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';

export const routes: Routes = [
  // RUTAS DE ADMIN
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'boleta', component: BoletaComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'list-usuarios', component: ListUsuariosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'reporte', component: ReporteComponent },
      { path: 'vendedores', component: VendedoresComponent },
    ]
  },
  {
    path: 'login', component: LoginComponent,

  },
  {
    path: 'register', component: RegisterComponent,

  },
   // RUTAS DE CLIENTE
  {
    path: '',
    component: ClienteLayout,
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'productos', component: ListaProductosComponent },
      { path: 'historial', component: HistorialCompraComponent },
      { path: 'contactanos', component: ContactanosComponent },

      // CHECKOUT
      {
        path: 'checkout',
        component: CheckoutLayoutComponent,
        children: [
          { path: '', redirectTo: 'datos', pathMatch: 'full' },
          { path: 'datos', component: DatosPersonalesComponent },
          { path: 'despacho', component: TipoDespachoComponent },
          { path: 'pago', component: MetodoPagoComponent }
        ]
      }
    ]
  },


  { path: '**', redirectTo: '/productos' },
];
