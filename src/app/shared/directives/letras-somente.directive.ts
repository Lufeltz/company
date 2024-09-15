import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[letras-somente]', 
  standalone: true,
})
export class LetrasSomenteDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    let valor = input.value;
    valor = valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    input.value = valor;
  }
}
