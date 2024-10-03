import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MilhasService } from '../../services/prototipo/milhas.service';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-r05-comprar-milhas',
  standalone: true,
  imports: [FormsModule, CurrencyMaskModule, CommonModule],
  templateUrl: './r05-comprar-milhas.component.html',
  styleUrls: ['./r05-comprar-milhas.component.css']
})

export class R05ComprarMilhasComponent {
  valorReais: number = 0; // Alterado para número
  quantidadeMilhas: number = 0;
  erroValor: string | null = null;

  constructor(private milhasService: MilhasService) {}

  calcularMilhas(): void {
    if (this.valorReais >= 5) {
      if (this.valorReais % 5 === 0) {
        this.quantidadeMilhas = Math.floor(this.valorReais / 5);
        this.erroValor = null;
      } else {
        this.quantidadeMilhas = 0;
        this.erroValor = 'O valor em reais deve ser um múltiplo de R$ 5,00.';
      }
    } else {
      this.quantidadeMilhas = 0;
      this.erroValor = 'O valor não pode ser inferior a R$ 5,00.';
    }
  }

  onSubmit(): void {
    if (this.erroValor) {
      return;  // Não permite o envio do formulário se houver erro
    }
    // Implementação da lógica de submit
    // Exemplo: this.milhasService.registrarCompra(this.valorReais, this.quantidadeMilhas);
  }
}
