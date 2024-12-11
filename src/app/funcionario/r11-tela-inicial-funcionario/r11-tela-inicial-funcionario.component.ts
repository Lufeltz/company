import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { R12ConfirmacaoEmbarqueComponent } from '../r12-confirmacao-embarque/r12-confirmacao-embarque.component';
import { R13CancelamentoDoVooComponent } from '../r13-cancelamento-do-voo/r13-cancelamento-do-voo.component';
import { R14RealizacaoDoVooComponent } from '../r14-realizacao-do-voo/r14-realizacao-do-voo.component';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';
import { StateService } from '../../services/api-gateway/state.service';

@Component({
  selector: 'app-r11-tela-inicial-funcionario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './r11-tela-inicial-funcionario.component.html',
  styleUrl: './r11-tela-inicial-funcionario.component.css',
})
export class R11TelaInicialFuncionarioComponent implements OnInit {
  public voos: VooGateway[] = [];
  public voosGateway: VooGateway[] = [];

  constructor(
    private modalService: NgbModal,
    private vooGatewayService: VooGatewayService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.getAllvoos();
    this.getAllVoosGateway();

    this.stateService.updateVoosFuncionarios$.subscribe(() => {
      this.getAllVoosGateway();
    });
  }

  getAllVoosGateway() {
    this.vooGatewayService.getAllVoos().subscribe({
      next: (data: VooGateway[] | null) => {
        if (data == null) {
          this.voosGateway = [];
        } else {
          this.voosGateway = data;
          console.log('voos 48h', this.voosGateway);
        }
      },
      error: (err) => {
        console.log('Erro ao carregar voos', err);
      },
    });
  }

  getAllvoos() {
    const dataAtual = new Date();
    const dataLimite = new Date(dataAtual.getTime() + 48 * 60 * 60 * 1000); // Adiciona 48 horas

    this.vooGatewayService.getAllVoos().subscribe({
      next: (data: VooGateway[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data.filter((voo) => {
            const dataVoo = new Date(voo.dataVoo);
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

  abrirModalConfirmacaoEmbarque(voo: VooGateway) {
    const modalRef = this.modalService.open(R12ConfirmacaoEmbarqueComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.vooRecebido = voo;
  }

  abrirModalCancelamentoVoo(voo: VooGateway) {
    const modalRef = this.modalService.open(R13CancelamentoDoVooComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.vooRecebido = voo;
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      // this.getAllVoosGateway();
      modalRef.close();
    });
  }

  abrirModalRealizacaoVoo(voo: VooGateway) {
    const modalRef = this.modalService.open(R14RealizacaoDoVooComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.vooRecebido = voo;

    modalRef.componentInstance.voltarClicked.subscribe(() => {
      // this.getAllVoosGateway();
      modalRef.close();
    });
  }
}
