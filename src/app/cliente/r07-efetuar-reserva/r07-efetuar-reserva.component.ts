import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';
import { VoosService } from '../../services/prototipo/voos.service';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-r07-efetuar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './r07-efetuar-reserva.component.html',
  styleUrl: './r07-efetuar-reserva.component.css',
})
export class R07EfetuarReservaComponent {
  voos: Voo[] = [];
  mensagem: string = '';

  //variaveis que armazenam valores dos inputs
  aeroportoOrigem: string = '';
  aeroportoDestino: string = '';

  constructor(
    private reservaService: ReservasService,
    private vooService: VoosService,
    private router: Router
  ) {}

  //****ainda temos que adicionar uma verificação que pega somente a partir da data atual****
  listarVoos(): Voo[] {
    this.vooService.getAllVoos().subscribe({
      next: (data: Voo[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data.filter(
            (voo) =>
              voo.aeroportoOrigem.includes(this.aeroportoOrigem) &&
              voo.aeroportoDestino.includes(this.aeroportoDestino)
          );
          if (this.voos.length === 0) {
            this.mensagem = 'Nenhum voo encontrado para esses aeroportos';
          } else {
            this.mensagem = '';
          }
        }
        this.aeroportoOrigem = '';
        this.aeroportoDestino = '';
      },
      error: (err) => {
        this.mensagem = 'Erro buscando voos';
        this.aeroportoOrigem = '';
        this.aeroportoDestino = '';
      },
    });

    return this.voos;
  }

  // Valida se os campos estão preenchidos
  isFormValid(): boolean {
    return (
      this.aeroportoOrigem.trim() !== '' && this.aeroportoDestino.trim() !== ''
    );
  }

  selecionarVoo(voo: Voo, event: Event): void {
    event.preventDefault(); // Previne o comportamento padrão do link
    this.router.navigate(['efetuar-reserva-2'], {
      state: { vooSelecionado: voo },
    });
  }
}
