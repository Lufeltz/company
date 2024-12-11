import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { R04VerReservaComponent } from '../r04-ver-reserva/r04-ver-reserva.component';
import { R08CancelarReservaComponent } from '../r08-cancelar-reserva/r08-cancelar-reserva.component';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { ModalCanceladoComponent } from '../r08-cancelar-reserva/confirmacao/modal-cancelado/modal-cancelado.component';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';
import { MilhasGatewayService } from '../../services/api-gateway/milhas-gateway.service';
import { MilhaDetalhesGateway } from '../../shared/models/api-gateway/milha-detalhes-gateway.model';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';

@Component({
  selector: 'app-r03-mostrar-tela-inicial-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r03-mostrar-tela-inicial-cliente.component.html',
  styleUrl: './r03-mostrar-tela-inicial-cliente.component.css',
})
export class R03MostrarTelaInicialClienteComponent {
  private cliente: Cliente = new Cliente();
  idCliente: number = 0;
  qntMilhasCliente: number = 0;

  reservasVoos: ReservaGateway[] | null = [];
  reservasReservadas: ReservaGateway[] | null = [];

  selectedTab: string = 'reservas';
  selectedEstadoReserva: string = 'CONFIRMADO';

  reservasFiltradas: ReservaGateway[] | null = [];

  constructor(
    private authGatewayService: AuthGatewayService,
    private modalService: NgbModal,
    private milhaGatewayService: MilhasGatewayService,
    private reservaGatewayService: ReservaGatewayService,
    private vooGatewayService: VooGatewayService
  ) {}

  ngOnInit(): void {
    this.getClienteByUser();
  }

  formatarEstadoReserva(estado: string): string {
    if (!estado) return '';
    return estado
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  filtrarReservas(event: any): void {
    const tipoEstadoReserva = event.target.value;
    if (tipoEstadoReserva) {
      this.reservasFiltradas =
        this.reservasReservadas?.filter(
          (reserva) => reserva.tipoEstadoReserva === tipoEstadoReserva
        ) || [];
    } else {
      this.reservasFiltradas = this.reservasReservadas;
    }
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
        this.vooGatewayService
          .getVoosCanceladosRealizados(idUsuario)
          .subscribe({
            next: (reservas: ReservaGateway[] | null) => {
              if (reservas) {
                this.reservasVoos = reservas;
                console.log(this.reservasVoos);
              }
            },
            error: (err) => {
              console.error(
                'Erro ao consultar voos realizados e cancelados',
                err
              );
            },
          });

        this.reservaGatewayService.listarReservasUsuario(idUsuario).subscribe({
          next: (reservas: ReservaGateway[] | null) => {
            if (reservas) {
              this.reservasReservadas = reservas;

              console.log(this.reservasReservadas);
            }
          },
          error: (err) => {
            console.error('Erro ao listar todas as reservas do cliente', err);
          },
        });

        this.milhaGatewayService.consultarExtrato(idUsuario).subscribe({
          next: (extrato: MilhaDetalhesGateway | null) => {
            if (extrato) {
              this.qntMilhasCliente = extrato.saldoMilhas;
            }
          },
          error: (err) => {
            console.error('Erro ao consultar extrato de milhas', err);
          },
        });
      }
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  visualizarReserva(reserva: ReservaGateway): void {
    const modalRef = this.modalService.open(R04VerReservaComponent);
    modalRef.componentInstance.reserva = reserva;
  }

  cancelarReserva(codigoReserva: string): void {
    if (!codigoReserva) {
      console.log('O código da reserva é obrigatório.');
      return;
    }

    const reservaEncontrada = this.reservasReservadas?.find(
      (reserva) => reserva.codigoReserva === codigoReserva
    );

    if (reservaEncontrada) {
      if (
        reservaEncontrada.tipoEstadoReserva === 'cancelada' ||
        reservaEncontrada.tipoEstadoReserva === 'cancelado voo'
      ) {
        const modalRef = this.modalService.open(ModalCanceladoComponent);
        modalRef.componentInstance.isCancelado = true;
      } else if (
        reservaEncontrada.tipoEstadoReserva === 'embarcado' ||
        reservaEncontrada.tipoEstadoReserva === 'não realizado'
      ) {
        const modalRef = this.modalService.open(ModalCanceladoComponent);
        modalRef.componentInstance.isOcorrido = true;
      } else {
        const modalRef = this.modalService.open(R08CancelarReservaComponent);
        modalRef.componentInstance.reserva = reservaEncontrada;
        modalRef.componentInstance.clienteLogado = this.cliente;
      }
    } else {
      console.error('Reserva não encontrada');
    }
  }

  get exibeLista(): boolean {
    if (this.reservasVoos![0] == null) {
      return true;
    } else {
      return false;
    }
  }

  get clienteLogado(): Cliente {
    return this.cliente;
  }
}
