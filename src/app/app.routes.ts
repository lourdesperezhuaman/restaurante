import { Routes } from '@angular/router';
import { DiseñoComponent } from './compartido/componentes/diseño/diseño.component';
import { InicioComponent } from './caracteristicas/inicio/inicio.component';
import { LoginComponent } from './caracteristicas/autenticacion/login/login.component';
import { RegistroComponent } from './caracteristicas/autenticacion/registro/registro.component';

export const routes: Routes = [
  // Rutas de autenticación (sin layout)
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  
  // Rutas principales (con layout)
  {
    path: '',
    component: DiseñoComponent,
    children: [
      {
        path: '',
        component: InicioComponent
      },
      // Más rutas aquí después
    ]
  }
];