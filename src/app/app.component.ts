import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'restaurante-pedidos';
  private firestore: Firestore = inject(Firestore);

}