import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'fechaFirebase',
  standalone: true
})
export class FechaFirebasePipe implements PipeTransform {
  /**
   * Convierte fechas de Firebase (Timestamp) a Date de JavaScript
   */
  transform(valor: any): Date {
    if (!valor) {
      return new Date();
    }

    // Si ya es un Date
    if (valor instanceof Date) {
      return valor;
    }

    // Si es un Timestamp de Firebase
    if (valor?.toDate && typeof valor.toDate === 'function') {
      return valor.toDate();
    }

    // Si es un objeto con seconds (formato Timestamp)
    if (valor?.seconds) {
      return new Date(valor.seconds * 1000);
    }

    // Intenta convertir directamente
    return new Date(valor);
  }
}