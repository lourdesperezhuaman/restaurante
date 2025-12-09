import { Routes } from '@angular/router';
import { FormularioPlatoComponent } from '../platos/formulario-plato/formulario-plato.component';
import { DashboardComponent } from '../tablero/dashboard/dashboard.component';
import { administradorGuard } from '../../nucleo/guardias/administrador.guard';

export const ADMINISTRACION_ROUTES: Routes = [
  {
    path: 'tablero',
    component: DashboardComponent,
    canActivate: [administradorGuard]
  },
  {
    path: 'platos/nuevo',
    component: FormularioPlatoComponent,
    canActivate: [administradorGuard]
  },
  {
    path: 'platos/editar/:id',
    component: FormularioPlatoComponent,
    canActivate: [administradorGuard]
  }
];