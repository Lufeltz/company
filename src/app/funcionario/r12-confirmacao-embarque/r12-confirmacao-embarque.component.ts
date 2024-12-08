import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';

@Component({
  selector: 'app-r12-confirmacao-embarque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './r12-confirmacao-embarque.component.html',
  styleUrl: './r12-confirmacao-embarque.component.css',
})
export class R12ConfirmacaoEmbarqueComponent implements OnInit {
  @Input() vooRecebido!: VooGateway;
  @ViewChild('formCodigoreserva') formCodigoReserva!: NgForm;

  ngOnInit() {}

  private reservas: ReservaGateway[] = [];
  codigoReserva: string = '';
  reservaNaoEncontrada: boolean = false;
  reservaEncontrada: boolean = false;
  reserva!: ReservaGateway;

  constructor(
    private reservaGatewayService: ReservaGatewayService,
    public activeModal: NgbActiveModal
  ) {}

  consultarReserva() {
    this.reservaGatewayService.consultarReserva(this.codigoReserva).subscribe({
      next: (data: ReservaGateway | null) => {
        if (data == null) {
          this.reservaNaoEncontrada = true;
          this.reservaEncontrada = false;
          console.log('não achei');
        } else {
          console.log('achei');
          this.reserva = data; // Atribui a reserva encontrada à variável
          console.log('reserva ', this.reserva);
          // Verifica se o código do voo da reserva corresponde ao voo recebido
          if (this.reserva.voo.codigoVoo === this.vooRecebido.codigoVoo) {
            this.reservaEncontrada = true;
            this.reservaNaoEncontrada = false;
          } else {
            // Se o voo não corresponder
            this.reservaNaoEncontrada = true;
            this.reservaEncontrada = false;
          }
        }
      },
      error: (err) => {
        console.log('Erro ao consultar reserva', err);
        this.reservaNaoEncontrada = true;
        this.reservaEncontrada = false;
      },
    });
  }

  confirmaReserva() {
    console.log(this.reserva);
    // this.reserva.tipoEstadoReserva = 'EMBARCADO';
    this.reservaGatewayService
      .confirmarEmbarque(this.reserva.voo.codigoVoo, this.reserva.codigoReserva)
      .subscribe({
        next: (response) => {
          if (response) {
            alert(
              'Reserva alterada com sucesso! Status da Reserva: ' +
                this.reserva.tipoEstadoReserva
            );
            console.log(this.reserva);
            this.activeModal.close();
          } else {
            console.log('Falha ao criar a reserva.');
            alert('Falha ao confirmar a reserva. Tente novamente.');
          }
        },
        error: (err) => {
          console.error('Erro ao confirmar a reserva:', err);
          alert('Falha ao confirmar a reserva. Tente novamente.');
        },
      });
  }
}
