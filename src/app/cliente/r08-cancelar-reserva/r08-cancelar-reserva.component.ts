import { Component, Input } from '@angular/core';
import { AlteracaoEstadoReservasService } from '../../services/prototipo/alteracao-estado-reservas.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { ModalConfirmarComponent } from './confirmacao/modal-confirmar/modal-confirmar.component';
import { MilhasService } from '../../services/prototipo/milhas.service';
import { Milha } from '../../shared/models/prototipo/milha.model';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { AlteracaoEstadoReserva } from '../../shared/models/prototipo/alteracao-estado-reserva.model';
import { ModalCanceladoComponent } from './confirmacao/modal-cancelado/modal-cancelado.component';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';

@Component({
  selector: 'app-r08-cancelar-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r08-cancelar-reserva.component.html',
  styleUrl: './r08-cancelar-reserva.component.css',
})
export class R08CancelarReservaComponent {
  @Input() reserva!: ReservaGateway;
  @Input() clienteLogado!: Cliente;

  constructor(
    public activeModal: NgbActiveModal,
    private reservaGatewayService: ReservaGatewayService,
    private milhasService: MilhasService,
    private clienteService: ClientesService,
    private alteracaoEstadoReservaService: AlteracaoEstadoReservasService,
    private modalService: NgbModal
  ) {}

  cancelarReserva(reserva: ReservaGateway): void {
    const modalRef = this.modalService.open(ModalConfirmarComponent);
    modalRef.result.then(
      (result) => {
        if (result === 'confirmed') {
          let estadoResAnterior: string = reserva.tipoEstadoReserva;
          // Atualiza o estado da reserva para "cancelada"

          // Chama o serviço para cancelar a reserva
          this.reservaGatewayService
            .cancelarReserva(reserva.codigoReserva)
            .subscribe(() => {
              let milha = new Milha();
              milha.dataHoraTransacao = new Date().toISOString();

              // Verifica se o voo existe e calcula as milhas
              if (reserva.voo) {
                milha.quantidadeMilhas = reserva.voo.valorPassagem / 5;
                this.clienteLogado.milhas += milha.quantidadeMilhas;

                // Atualiza o saldo de milhas do cliente
                this.clienteService
                  .putCliente(this.clienteLogado)
                  .subscribe(() => {
                    console.log('Saldo do cliente atualizado com sucesso!');
                  });
              }

              // Cria um registro de alteração de reserva
              let registro: AlteracaoEstadoReserva =
                new AlteracaoEstadoReserva();
              registro.codigoReserva = reserva.codigoReserva;
              registro.dataHoraAlteracao = new Date().toISOString();
              registro.estadoDestino = reserva.tipoEstadoReserva;
              registro.estadoOrigem = estadoResAnterior;
              this.alteracaoEstadoReservaService
                .postAlteracaoEstadoReservas(registro)
                .subscribe(() => {});

              // Cria um registro de transação de milhas
              milha.tipoTransacao = 'entrada';
              milha.descricao = 'Cancelamento de reserva';
              milha.cliente = this.clienteLogado.email
                .split('@')[0]
                .replace('.', ' ');
              this.milhasService.postMilha(milha).subscribe(() => {
                console.log('Registro de milhas gerado com sucesso!');
              });

              // Exibe o modal de sucesso de cancelamento
              const sucessoModalRef = this.modalService.open(
                ModalCanceladoComponent
              );
            });
        }
      },
      (reason) => {
        console.log('Confirmação de cancelamento negada');
      }
    );
  }
}
