import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MilhasService } from '../../services/prototipo/milhas.service';

@Component({
  selector: 'app-r05-comprar-milhas',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './r05-comprar-milhas.component.html',
  styleUrls: ['./r05-comprar-milhas.component.css']
})

export class R05ComprarMilhasComponent {
  valorReais: string = 'R$ 0,00'; // Valor inicial exibido
  quantidadeMilhas: number = 0;
  erroValor: string | null = null;

  constructor(private milhasService: MilhasService) {}

  calcularMilhas(): void {
    const valorNumerico = this.parseValue(this.valorReais);

    if (valorNumerico !== null && valorNumerico % 5 === 0 && valorNumerico >= 5) {
      this.quantidadeMilhas = Math.floor(valorNumerico / 5);
      this.erroValor = null;
    } else {
      this.quantidadeMilhas = 0;
      this.erroValor = 'O valor em reais deve ser um múltiplo de R$ 5,00 e não pode ser inferior a R$ 5,00.';
    }
  }

  onSubmit(): void {
    if (this.erroValor) {
      // Não permite o envio do formulário se houver erro
      return;
    }
    // Implementação da logica de submit
    // this.milhasService.registrarCompra(this.valorReais, this.quantidadeMilhas);
  }

  handleFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === 'R$ 0,00') {
      input.value = '';
      this.valorReais = ''; // Limpa o valor para que o usuário possa digitar
    }
  }

  handleBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '') {
      input.value = 'R$ 0,00';
      this.valorReais = 'R$ 0,00'; // Restabelece o valor inicial se o campo estiver vazio
    } else {
      this.valorReais = input.value;
      this.calcularMilhas();
    }
  }

  private parseValue(valor: string): number | null {
    // Remove "R$ " e substitui o separador de milhar por nada, depois substitui a vírgula por ponto para conversão numérica
    const valorFormatado = valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const numero = parseFloat(valorFormatado);
    return isNaN(numero) ? null : numero;
  }
}