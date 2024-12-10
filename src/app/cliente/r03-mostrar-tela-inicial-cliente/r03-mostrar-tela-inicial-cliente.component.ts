import { Component } from '@angular/core';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { VoosService } from '../../services/prototipo/voos.service';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { R04VerReservaComponent } from '../r04-ver-reserva/r04-ver-reserva.component';
import { LoginService } from '../../services/prototipo/login.service';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { R08CancelarReservaComponent } from '../r08-cancelar-reserva/r08-cancelar-reserva.component';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { ModalCanceladoComponent } from '../r08-cancelar-reserva/confirmacao/modal-cancelado/modal-cancelado.component';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';
import { MilhasGatewayService } from '../../services/api-gateway/milhas-gateway.service';
import { MilhaDetalhesGateway } from '../../shared/models/api-gateway/milha-detalhes-gateway.model';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';

@Component({
  selector: 'app-r03-mostrar-tela-inicial-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r03-mostrar-tela-inicial-cliente.component.html',
  styleUrl: './r03-mostrar-tela-inicial-cliente.component.css',
})
export class R03MostrarTelaInicialClienteComponent {
  private reservas: Reserva[] = [];
  private voos: Voo[] = [];
  private reservasComVoos: { reserva: Reserva; voo: Voo | undefined }[] = [];

  private cliente: Cliente = new Cliente();
  idCliente: number = 0;
  qntMilhasCliente: number = 0;

  constructor(
    private authGatewayService: AuthGatewayService,
    private modalService: NgbModal,
    private milhaGatewayService: MilhasGatewayService,
    private reservasService: ReservasService,
    private reservaGatewayService: ReservaGatewayService,
    private voosService: VoosService
  ) {}

  ngOnInit(): void {
    this.loadReservas();
    this.getClienteByUser();
  }

  cancelarReserva(codigoReserva: string) {
    if (codigoReserva) {
      // this.mensagemErro = 'O código da reserva é obrigatório.';
      console.log('O código da reserva é obrigatório.');

      return;
    }

    this.reservaGatewayService.cancelarReserva(codigoReserva).subscribe(
      (response) => {
        // this.mensagemSucesso = 'Reserva cancelada com sucesso!';
        // this.mensagemErro = ''; // Limpa a mensagem de erro

        console.log('Reserva cancelada com sucesso!');
      },
      (error) => {
        // this.mensagemErro = 'Erro ao cancelar a reserva. Tente novamente.';
        // this.mensagemSucesso = ''; // Limpa a mensagem de sucesso
        console.error('Erro ao cancelar reserva:', error);
      }
    );
  }

  loadReservas(): Reserva[] {
    this.reservasService.getAllReservas().subscribe({
      next: (data: Reserva[] | null) => {
        if (data == null) {
          this.reservas = [];
        } else {
          this.reservas = data;
          this.loadVoos();
        }
      },
      error: (err) => {
        console.log('Erro ao carregar reservas da base de dados');
      },
    });
    return this.reservas;
  }

  loadVoos(): Voo[] {
    this.voosService.getAllVoos().subscribe({
      next: (data: Voo[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data;
          this.associarReservasComVoos();
        }
      },
      error: (err) => {
        console.log('Erro ao carregar voos da base de dados');
      },
    });

    return this.voos;
  }

  associarReservasComVoos(): void {
    this.reservasComVoos = this.reservas
      .map((reserva) => {
        const vooRelacionado = this.voos.find(
          (voo) => voo.codigoVoo === reserva.codigoVoo
        );
        return { reserva, voo: vooRelacionado };
      })
      .sort((a, b) => {
        const dataA = new Date(a.voo?.dataHora || 0).getTime();
        const dataB = new Date(b.voo?.dataHora || 0).getTime();
        return dataB - dataA;
      });
  }

  getClienteByUser(): void {
    const usuario = this.authGatewayService.getUser();
    if (usuario) {
      const role = this.authGatewayService.getRoleFromToken();
      let idUsuario: number | null = null;

      if (role === 'CLIENTE' && 'idCliente' in usuario) {
        idUsuario = Number(usuario.idCliente);
        this.idCliente = idUsuario;
      } else if (role === 'FUNCIONARIO' && 'idFuncionario' in usuario) {
        idUsuario = Number(usuario.idFuncionario);
        this.idCliente = idUsuario;
      }

      if (idUsuario !== null) {
        // Consultar o extrato de milhas do cliente
        this.milhaGatewayService.consultarExtrato(idUsuario).subscribe({
          next: (extrato: MilhaDetalhesGateway | null) => {
            if (extrato) {
              this.qntMilhasCliente = extrato.saldoMilhas; // Atualizando o saldo de milhas
            }
          },
          error: (err) => {
            console.error('Erro ao consultar extrato de milhas', err);
          },
        });
      }
    }
  }

  visualizarReserva(reserva: { reserva: Reserva; voo: Voo | undefined }): void {
    const modalRef = this.modalService.open(R04VerReservaComponent);
    modalRef.componentInstance.reserva = reserva;
  }

  // cancelarReserva(
  //   reserva: { reserva: Reserva; voo: Voo | undefined },
  //   cliente: Cliente
  // ): void {
  //   if (
  //     reserva.reserva.estadoReserva == 'cancelada' ||
  //     reserva.reserva.estadoReserva == 'cancelado voo'
  //   ) {
  //     const modalRef = this.modalService.open(ModalCanceladoComponent);
  //     modalRef.componentInstance.isCancelado = true;
  //   } else if (
  //     reserva.reserva.estadoReserva == 'embarcado' ||
  //     reserva.reserva.estadoReserva == 'não realizado'
  //   ) {
  //     const modalRef = this.modalService.open(ModalCanceladoComponent);
  //     modalRef.componentInstance.isOcorrido = true;
  //   } else {
  //     const modalRef = this.modalService.open(R08CancelarReservaComponent);
  //     modalRef.componentInstance.reserva = reserva;
  //     modalRef.componentInstance.clienteLogado = cliente;
  //   }
  // }

  get listReservasComVoos(): { reserva: Reserva; voo: Voo | undefined }[] {
    return this.reservasComVoos;
  }

  get exibeLista(): boolean {
    if (this.reservas[0] == null) {
      return true;
    } else {
      return false;
    }
  }

  get clienteLogado(): Cliente {
    return this.cliente;
  }
}
