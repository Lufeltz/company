import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { VooGateway } from '../../../../shared/models/api-gateway/voo-gateway';
import { ReservaGatewayService } from '../../../../services/api-gateway/reserva-gateway.service';
import { ReservaGateway } from '../../../../shared/models/api-gateway/reserva-gateway.model';

@Component({
  selector: 'app-modal-checkin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-checkin.component.html',
  styleUrl: './modal-checkin.component.css',
})
export class ModalCheckinComponent {
  reserva: ReservaGateway = new ReservaGateway();
  dia: string = '';
  hora: string = '';
  confirmacao: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private reservaGatewayService: ReservaGatewayService
  ) {}

  ngOnInit(): void {
    this.formatarDataHora();
  }

  confirmar() {}

  realizarCheckin(): void {
    if (!this.reserva.codigoReserva) {
      console.log('Informe o código da reserva.');
      return;
    }

    this.reservaGatewayService
      .realizarCheckin(this.reserva.codigoReserva)
      .subscribe(
        (response) => {
          this.activeModal.close({ success: true, reserva: this.reserva }); // Passa o voo de volta para o componente pai
          // console.log('Fechando modal com sucesso', {
          //   success: true,
          //   reserva: this.reserva,
          // });
        },
        (error) => {
          console.error('Erro ao realizar check-in filho:', error);
          this.activeModal.close({ success: false, error }); // Passa erro caso ocorra algum problema
          console.log('Fechando modal com falha', {
            success: true,
            reserva: this.reserva,
          });
        }
      );
  }

  formatarDataHora(): void {
    const partesDataHora = this.reserva.voo.dataVoo.split('T');
    const partesData = partesDataHora[0].split('-');
    this.dia = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
    this.hora = partesDataHora[1].split('Z')[0].substring(0, 5);
  }
}
