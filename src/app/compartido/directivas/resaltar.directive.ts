import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class ResaltarDirective {
  @Input() colorResaltado = '#fff3cd'; // Color por defecto (amarillo claro)
  @Input() colorOriginal = 'transparent';

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.transition = 'background-color 0.3s ease';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar(this.colorResaltado);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar(this.colorOriginal);
  }

  private resaltar(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}