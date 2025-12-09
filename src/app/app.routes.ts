import { Routes } from '@angular/router';
import { DiseñoComponent } from './compartido/componentes/diseño/diseño.component';
import { InicioComponent } from './caracteristicas/inicio/inicio.component';
import { LoginComponent } from './caracteristicas/autenticacion/login/login.component';
import { RegistroComponent } from './caracteristicas/autenticacion/registro/registro.component';
import { ListaPedidosComponent } from './caracteristicas/pedidos/lista-pedidos/lista-pedidos.component';
import { FormularioPedidoComponent } from './caracteristicas/pedidos/formulario-pedido/formulario-pedido.component';
import { ListaPlatosComponent } from './caracteristicas/platos/lista-platos/lista-platos.component';
import { PaginaNoEncontradaComponent } from './compartido/componentes/pagina-no-encontrada/pagina-no-encontrada.component';
import { autenticacionGuard } from './nucleo/guardias/autenticacion.guard';

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
        path: 'pedidos/nuevo',
        component: FormularioPedidoComponent
      },
      {
        path: 'platos',
        component: ListaPlatosComponent
      },
      // Lazy Loading - Módulo de Administración
      {
        path: '',
        loadChildren: () => import('./caracteristicas/administracion/administracion.routes')
          .then(m => m.ADMINISTRACION_ROUTES)
      },
      // 404 dentro del layout
      {
        path: '**',
        component: PaginaNoEncontradaComponent
      }
    ]
  },
  
  // 404 fuera del layout (cuando no está autenticado)
  {
    path: '**',
    component: PaginaNoEncontradaComponent
  }
];