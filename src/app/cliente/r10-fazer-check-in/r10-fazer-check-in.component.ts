import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlteracaoEstadoReservasService } from '../../services/prototipo/alteracao-estado-reservas.service';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';
import { ModalCheckinComponent } from './confirmacao/modal-checkin/modal-checkin.component';
import { ModalSuccessCheckinComponent } from './confirmacao/modal-success-checkin/modal-success-checkin.component';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';

@Component({
  selector: 'app-r10-fazer-check-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r10-fazer-check-in.component.html',
  styleUrl: './r10-fazer-check-in.component.css',
})
export class R10FazerCheckInComponent {
  exibeLista: boolean = false;
  reservas: ReservaGateway[] | null = [];

  private voosProximos: Voo[] = [];

  constructor(
    private reservaGatewayService: ReservaGatewayService,
    private authGatewayService: AuthGatewayService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listarReservasVoos48h();
  }

  listarReservasVoos48h(): void {
    const usuario = this.authGatewayService.getUser();
    if (usuario) {
      const role = this.authGatewayService.getRoleFromToken();

      let idUsuario: number = 0;

      if (role === 'CLIENTE' && 'idCliente' in usuario) {
        idUsuario = Number(usuario.idCliente);
      } else if (role === 'FUNCIONARIO' && 'idFuncionario' in usuario) {
        idUsuario = Number(usuario.idFuncionario);
      }

      this.reservaGatewayService.listarReservasVoos48h(idUsuario).subscribe({
        next: (reservas) => {
          this.reservas = reservas;
          console.log('reservas sem dados voo', reservas);
          this.exibeLista = true;
        },
        error: (err) => {
          console.error(
            'Erro ao listar reservas dos voos das próximas 48 horas',
            err
          );
        },
      });
    }
  }

  formatarTempoEntreDatas(data: string): string {
    const dataInicial: Date = new Date();
    const dataFinal = new Date(data);
    const diferençaEmMs = dataFinal.getTime() - dataInicial.getTime();

    const segundos: number = diferençaEmMs / 1000;

    const dias: number = Math.floor(segundos / (24 * 3600));
    const horas: number = Math.floor((segundos % (24 * 3600)) / 3600);
    const minutos: number = Math.floor((segundos % 3600) / 60);

    let partes: string[] = [];

    if (dias > 0) partes.push(`${dias} dia${dias > 1 ? 's' : ''}`);
    if (horas > 0) partes.push(`${horas} hora${horas > 1 ? 's' : ''}`);
    if (minutos > 0) partes.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`);

    return partes.join(' e ');
  }

  fazerCheckIn(reserva: ReservaGateway): void {
    const modalRef = this.modalService.open(ModalCheckinComponent);
    modalRef.componentInstance.reserva = reserva;

    modalRef.result.then(
      (result) => {
        if (result && result.success) {
          const sucessoModalRef = this.modalService.open(
            ModalSuccessCheckinComponent
          );
          sucessoModalRef.componentInstance.voo = result.voo;
        } else {
          console.log('Erro ao realizar check-in:', result?.error);
        }
      },
      (reason) => {
        console.log('Checkin falhou:', reason);
      }
    );
  }

  get listVoosProximos(): Voo[] {
    return this.voosProximos;
  }
}
