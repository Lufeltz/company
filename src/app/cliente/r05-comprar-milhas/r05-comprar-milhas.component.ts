import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/prototipo/login.service';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalNotificacaoComponent } from './modal-notificacao/modal-notificacao.component';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MilhasGatewayService } from '../../services/api-gateway/milhas-gateway.service';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';

@Component({
  selector: 'app-r05-comprar-milhas',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyMaskModule,
    CommonModule,
    ModalNotificacaoComponent,
    NgbModalModule,
  ],
  templateUrl: './r05-comprar-milhas.component.html',
  styleUrls: ['./r05-comprar-milhas.component.css'],
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

  resultado: any;
  erro!: string;

  constructor(
    private milhasGatewayService: MilhasGatewayService,
    private loginService: LoginService,
    private modalService: NgbModal,
    private authGatewayService: AuthGatewayService
  ) {
    const usuarioLogado = this.loginService.getUsuarioLogado();

    if (usuarioLogado) {
      this.loginCliente = usuarioLogado.login;
      this.idCliente = usuarioLogado.id;
    }
  }

  comprarMilhas(quantidadeMilhas: number): void {
    const usuario = this.authGatewayService.getUser();

    if (usuario) {
      const role = this.authGatewayService.getRoleFromToken();

      let idUsuario: number | null = null;

      if (role === 'CLIENTE' && 'idCliente' in usuario) {
        idUsuario = Number(usuario.idCliente);
      } else if (role === 'FUNCIONARIO' && 'idFuncionario' in usuario) {
        idUsuario = Number(usuario.idFuncionario);
      }

      if (idUsuario !== null) {
        this.milhasGatewayService
          .comprarMilhas(idUsuario, quantidadeMilhas)
          .subscribe(
            (response) => {
              this.resultado = response;
              console.log(
                'Milhas compradas com sucesso:',
                this.quantidadeMilhas
              );
              this.mensagemModal = 'Compra registrada com sucesso!';
              this.tipoModal = 'sucesso';
              this.limparCampos();
              this.abrirModal();
            },
            (error) => {
              this.erro = 'Erro ao comprar milhas';
              console.error('Erro:', error);
              this.mensagemModal = 'Erro ao registrar a compra';
              this.tipoModal = 'erro';
              this.abrirModal();
            }
          );
      } else {
        this.erro = 'ID do usuário não encontrado!';
        console.error('Erro: ID do usuário não encontrado');
      }
    } else {
      this.erro = 'Usuário não autenticado!';
      console.error('Erro: Usuário não encontrado');
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
