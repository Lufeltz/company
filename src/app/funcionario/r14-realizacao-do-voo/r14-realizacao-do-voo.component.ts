import { Component, Input } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { ReservasService } from '../../services/prototipo/reservas.service';

@Component({
  selector: 'app-r14-realizacao-do-voo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r14-realizacao-do-voo.component.html',
  styleUrl: './r14-realizacao-do-voo.component.css',
})
export class R14RealizacaoDoVooComponent {
  @Input() vooRecebido!: Voo;

  constructor(
    private voosService: VoosService,
    public activeModal: NgbActiveModal,
    private reservaService: ReservasService
  ) {}

  realizacaoVoo() {
    this.reservaService.getAllReservas().subscribe({
      next: (reservas: Reserva[] | null) => {
        if (!reservas) {
          reservas = [];
        }

        // Filtra as reservas que pertencem ao vooRecebido
        const reservasDoVoo = reservas.filter(
          (reserva) => reserva.codigoVoo === this.vooRecebido.codigoVoo
        );

        // Variável para controle de sucesso das atualizações
        let falhaNaAtualizacao = false;

        // Itera sobre as reservas do voo e altera o estado
        reservasDoVoo.forEach((reserva) => {
          if (reserva.estadoReserva === 'embarcado') {
            reserva.estadoReserva = 'realizado';
          } else {
            reserva.estadoReserva = 'não realizado';
          }

          // Atualiza cada reserva no backend
          this.reservaService.putReserva(reserva).subscribe({
            next: (response) => {
              console.log('Reserva atualizada com sucesso:', reserva);
            },
            error: (err) => {
              console.error('Erro ao atualizar reserva:', err);
              falhaNaAtualizacao = true;
            },
          });
        });

        // Mensagem final após o processamento de todas as reservas
        if (falhaNaAtualizacao) {
          alert('Houve um erro ao atualizar algumas reservas.');
        } else {
          alert('Todas as reservas do voo foram atualizadas com sucesso.');
        }

        // Fechar o modal após o processo
        this.activeModal.close();
      },
      error: (err) => {
        console.log('Erro ao carregar reservas da base de dados:', err);
        alert('Erro ao carregar as reservas. Tente novamente mais tarde.');
      },
    });
  }
}
