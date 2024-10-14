import { Component, Input } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { ReservasService } from '../../services/prototipo/reservas.service';

@Component({
  selector: 'app-r13-cancelamento-do-voo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r13-cancelamento-do-voo.component.html',
  styleUrl: './r13-cancelamento-do-voo.component.css',
})
export class R13CancelamentoDoVooComponent {
  @Input() vooRecebido!: Voo;

  constructor(
    private voosService: VoosService,
    public activeModal: NgbActiveModal,
    private reservaService: ReservasService
  ) {}

  //aqui tem que fazer a validação se o voo esta no estado confirmado, porem o model esta errado, então sera feito mais tarde na implementação do back
  cancelarVoo() {
    let allReservas: Reserva[] = [];
    let reservasDoVoo: Reserva[] = [];

    this.reservaService.getAllReservas().subscribe({
      next: (data: Reserva[] | null) => {
        if (data == null) {
          allReservas = [];
        } else {
          allReservas = data;

          // Filtra as reservas que pertencem ao vooRecebido
          reservasDoVoo = allReservas.filter(
            (reserva) => reserva.codigoVoo === this.vooRecebido.codigoVoo
          );

          // Itera sobre as reservas do voo e altera o estado para 'cancelado voo'
          reservasDoVoo.forEach((reserva) => {
            reserva.estadoReserva = 'cancelado voo';

            // Atualiza cada reserva no backend
            this.reservaService.putReserva(reserva).subscribe({
              next: (response) => {
                console.log('Reserva atualizada com sucesso:', reserva);
              },
              error: (err) => {
                console.error('Erro ao atualizar reserva:', err);
              },
            });
          });

          alert('Todas as reservas do voo foram canceladas.');
          this.activeModal.close();
        }
      },
      error: (err) => {
        console.log('Erro ao carregar reservas da base de dados:', err);
      },
    });
  }
}
