import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
  standalone: true
})
export class MonedaPipe implements PipeTransform {
  /**
   * Transforma un número a formato de moneda
   * Ejemplo: 15.50 → S/ 15.50
   */
  transform(valor: number, simbolo: string = 'S/'): string {
    if (valor === null || valor === undefined) {
      return `${simbolo} 0.00`;
    }
    
    return `${simbolo} ${valor.toFixed(2)}`;
  }
}