import { Routes } from '@angular/router';
import { DiseñoComponent } from './compartido/componentes/diseño/diseño.component';
import { InicioComponent } from './caracteristicas/inicio/inicio.component';
import { LoginComponent } from './caracteristicas/autenticacion/login/login.component';
import { RegistroComponent } from './caracteristicas/autenticacion/registro/registro.component';
import { ListaPedidosComponent } from './caracteristicas/pedidos/lista-pedidos/lista-pedidos.component';
import { ListaPlatosComponent } from './caracteristicas/platos/lista-platos/lista-platos.component';
import { autenticacionGuard } from './nucleo/guardias/autenticacion.guard';

export const routes: Routes = [
  // Aun no ponemos la rutas layout o como se diga
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  
  // Rutas protegidas aca si tiene layout y la autenticacion
  {
    path: '',
    component: DiseñoComponent,
    canActivate: [autenticacionGuard], // AcA protegemos la rutas
    children: [
      {
        path: '',
        component: InicioComponent
      },
      {
        path: 'pedidos',
        component: ListaPedidosComponent
      },
      {
        path: 'platos',
        component: ListaPlatosComponent
      }
      //uhmm otras rutas pondriamos
    ]
  },
  
  // Ruta 404 - No encontrado segun el word
  {
    path: '**',
    redirectTo: ''
  }
];