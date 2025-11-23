import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacionComponent } from '../barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-diseño',
  standalone: true,
  imports: [RouterOutlet, BarraNavegacionComponent],
  templateUrl: './diseño.component.html',
  styleUrls: ['./diseño.component.css']
})
export class DiseñoComponent {

}