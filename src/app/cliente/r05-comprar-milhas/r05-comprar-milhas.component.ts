import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MilhasService } from '../../services/prototipo/milhas.service';
import { LoginService } from '../../services/prototipo/login.service';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Milha } from '../../shared/models/prototipo/milha.model';
import { ModalNotificacaoComponent } from './modal-notificacao/modal-notificacao.component';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-r05-comprar-milhas',
  standalone: true,
  imports: [FormsModule, CurrencyMaskModule, CommonModule, ModalNotificacaoComponent, NgbModalModule],
  templateUrl: './r05-comprar-milhas.component.html',
  styleUrls: ['./r05-comprar-milhas.component.css']
})

export class R05ComprarMilhasComponent {
  valorReais: number = 0;
  quantidadeMilhas: number = 0;
  erroValor: string | null = null;
  loginCliente: string = '';
  idCliente: string = '';
  mostrarModal: boolean = false;
  mensagemModal: string = '';
  tipoModal: 'sucesso' | 'erro' = 'sucesso'; 

  constructor(
    private milhasService: MilhasService,
    private loginService: LoginService,
    private modalService: NgbModal

    ){
      const usuarioLogado = this.loginService.getUsuarioLogado();

      if (usuarioLogado) {
        this.loginCliente = usuarioLogado.login;
        this.idCliente = usuarioLogado.id;
      }
  }

  calcularMilhas(): void {
    if (this.valorReais <= 0) {
      this.quantidadeMilhas = 0;
      this.erroValor = 'O valor deve ser maior que R$ 0,00.';
      return;
    }

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
    if (this.erroValor || this.valorReais <= 0) {
      this.erroValor = 'A compra de milhas não pode ser realizada com valor igual ou menor que zero.';
      return; // Não permite o envio do formulário se houver erro
    }

    const usuarioLogado = this.loginService.getUsuarioLogado();
    console.log(usuarioLogado); 

    const compra: Milha = {
        id: this.gerarIdUnico(), // Gera um ID único para a transação
        cliente: this.loginCliente,
        idCliente: this.idCliente,
        dataHoraTransacao: new Date(new Date().getTime() - (3 * 60 * 60 * 1000)).toISOString(), // Ajusta para UTC-3
        quantidadeMilhas: this.quantidadeMilhas,
        tipoTransacao: 'entrada',
        descricao: 'Compra de milhas'
    };

    this.milhasService.postMilha(compra).subscribe({
        next: (res) => {
          this.mensagemModal = 'Compra registrada com sucesso!';
          this.tipoModal = 'sucesso';
          this.limparCampos();
          this.abrirModal();
        },
        error: (err) => {
          this.mensagemModal = 'Erro ao registrar a compra';
          this.tipoModal = 'erro';
          this.abrirModal();
        }
    });
  }

  gerarIdUnico(): string {
    return Math.random().toString(36).slice(2, 11);
  }

  abrirModal(): void {
    const modalRef = this.modalService.open(ModalNotificacaoComponent);
    modalRef.componentInstance.mensagem = this.mensagemModal;
    modalRef.componentInstance.tipo = this.tipoModal;
  }

  limparCampos(): void {
    this.valorReais = 0;
    this.quantidadeMilhas = 0;
    this.erroValor = null;
  }
}
