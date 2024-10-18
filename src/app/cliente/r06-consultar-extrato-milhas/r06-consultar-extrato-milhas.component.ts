import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MilhasService } from "../../services/prototipo/milhas.service";
import {Milha} from "../../shared/models/prototipo/milha.model";
import {VoosService} from "../../services/prototipo/voos.service";
import {Voo} from "../../shared/models/prototipo/voo.model";
import { PipeDinheiroBRPipe } from '../../shared/pipes/pipe-dinheiro-br.pipe';

@Component({
  selector: 'app-r06-consultar-extrato-milhas',
  standalone: true,
  imports: [CommonModule, PipeDinheiroBRPipe],
  templateUrl: './r06-consultar-extrato-milhas.component.html',
  styleUrl: './r06-consultar-extrato-milhas.component.css'
})
export class R06ConsultarExtratoMilhasComponent implements OnInit {
  totalMilhas: number = 0;
  milhas: Milha[] = [];
  voos: Voo[] = [];
  loading: boolean = false;
  mensagemErro: string = '';

  constructor(
    private milhasService: MilhasService,
    private voosService: VoosService,
  ) {}

  ngOnInit() {
    this.carregarCompraMilhas();
    this.carregarUsoMilhas();
  }

  carregarCompraMilhas() {
    this.loading = true;

    this.milhasService.getAllMilhas().subscribe({
      next: (milhas: Milha[] | null) => {
        this.loading = false;

        if (milhas) {
          this.milhas = milhas;

          this.totalMilhas = milhas.reduce((total, milha) => {
            if (milha.tipoTransacao === 'entrada') {
              return total + milha.quantidadeMilhas;
            } else if (milha.tipoTransacao === 'saída') {
              return total - milha.quantidadeMilhas;
            }
            return total;
          }, 0);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar as milhas', err);

        this.loading = false;
        this.mensagemErro = `Erro ao carregar as milhas`;
      },
    });
  }

  carregarUsoMilhas() {
    this.loading = true;

    this.voosService.getAllVoos().subscribe({
      next: (voos: Voo[] | null) => {
        this.loading = false;

        if (voos) {
          this.voos = voos;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar as voos', err);

        this.loading = false;
        this.mensagemErro = `Erro ao carregar as voos`;
      },
    });
  }
}

