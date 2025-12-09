import { Routes } from '@angular/router';
import { DiseñoComponent } from './compartido/componentes/diseño/diseño.component';
import { InicioComponent } from './caracteristicas/inicio/inicio.component';
import { LoginComponent } from './caracteristicas/autenticacion/login/login.component';
import { RegistroComponent } from './caracteristicas/autenticacion/registro/registro.component';
import { ListaPedidosComponent } from './caracteristicas/pedidos/lista-pedidos/lista-pedidos.component';
import { ListaPlatosComponent } from './caracteristicas/platos/lista-platos/lista-platos.component';
import { FormularioPlatoComponent } from './caracteristicas/platos/formulario-plato/formulario-plato.component';
import { autenticacionGuard } from './nucleo/guardias/autenticacion.guard';
import { administradorGuard } from './nucleo/guardias/administrador.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  
  // Rutas protegidas
  {
    path: '',
    component: DiseñoComponent,
    canActivate: [autenticacionGuard],
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
      },
      {
        path: 'platos/nuevo',
        component: FormularioPlatoComponent,
        canActivate: [administradorGuard] // Solo admins
      },
      {
        path: 'platos/editar/:id',
        component: FormularioPlatoComponent,
        canActivate: [administradorGuard] // Solo admins
      }
    ]
  },
  
  // 404
  {
    path: '**',
    redirectTo: ''
  }
];