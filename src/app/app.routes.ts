import { Routes } from '@angular/router';
import { DiseñoComponent } from './compartido/componentes/diseño/diseño.component';
import { InicioComponent } from './caracteristicas/inicio/inicio.component';

export const routes: Routes = [
  {
    path: '',
    component: DiseñoComponent,
    children: [
      {
        path: '',
        component: InicioComponent
      },
      // Aquí agregaremos más rutas después
    ]
  }
];