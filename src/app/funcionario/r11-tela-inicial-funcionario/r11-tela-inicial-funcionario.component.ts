import { Component, OnInit } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { R12ConfirmacaoEmbarqueComponent } from '../r12-confirmacao-embarque/r12-confirmacao-embarque.component';
import { R13CancelamentoDoVooComponent } from '../r13-cancelamento-do-voo/r13-cancelamento-do-voo.component';
import { R14RealizacaoDoVooComponent } from '../r14-realizacao-do-voo/r14-realizacao-do-voo.component';

@Component({
  selector: 'app-r11-tela-inicial-funcionario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './r11-tela-inicial-funcionario.component.html',
  styleUrl: './r11-tela-inicial-funcionario.component.css',
})
export class R11TelaInicialFuncionarioComponent implements OnInit {
  public voos: Voo[] = [];

  constructor(
    private voosService: VoosService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllvoos();
  }

  getAllvoos() {
    const dataAtual = new Date();
    const dataLimite = new Date(dataAtual.getTime() + 48 * 60 * 60 * 1000); // Adiciona 48 horas

    this.voosService.getAllVoos().subscribe({
      next: (data: Voo[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data.filter((voo) => {
            const dataVoo = new Date(voo.dataHora);
            return dataVoo >= dataAtual && dataVoo <= dataLimite;
          });
        }
      },
      error: (err) => {
        console.log('Erro ao carregar voos');
      },
    });
  }

  //AÇÕES DOS BOTÕES

  abrirModalConfirmacaoEmbarque(voo: Voo) {
    const modalRef = this.modalService.open(R12ConfirmacaoEmbarqueComponent);
    modalRef.componentInstance.vooRecebido = voo;
  }

  abrirModalCancelamentoVoo(voo: Voo) {
    const modalRef = this.modalService.open(R13CancelamentoDoVooComponent);
    modalRef.componentInstance.vooRecebido = voo;
  }

  abrirModalRealizacaoVoo(voo: Voo) {
    const modalRef = this.modalService.open(R14RealizacaoDoVooComponent);
    modalRef.componentInstance.vooRecebido = voo;
  }
}
