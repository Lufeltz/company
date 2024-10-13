import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Reserva } from '../../shared/models/prototipo/reserva.model';

@Component({
  selector: 'app-r12-confirmacao-embarque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './r12-confirmacao-embarque.component.html',
  styleUrl: './r12-confirmacao-embarque.component.css',
})
export class R12ConfirmacaoEmbarqueComponent implements OnInit {
  @Input() vooRecebido!: Voo;
  @ViewChild('formCodigoreserva') formCodigoReserva!: NgForm;

  ngOnInit() {}

  private reservas: Reserva[] = [];
  codigoReserva: string = '';
  reservaNaoEncontrada: boolean = false;
  reservaEncontrada: boolean = false;
  reserva!: Reserva;

  constructor(
    private voosService: VoosService,
    private reservaService: ReservasService,
    public activeModal: NgbActiveModal
  ) {}

  consultarReserva() {
    this.reservaService.getAllReservas().subscribe({
      next: (data: Reserva[] | null) => {
        if (data == null) {
          this.reservas = [];
        } else {
          this.reservas = data;

          // Filtra a lista de reservas para encontrar a reserva com o código digitado
          const reservaEncontradanaLista = this.reservas.find(
            (reserva) => reserva.codigoReserva === this.codigoReserva
          );

          // Verifica se a reserva foi encontrada
          if (reservaEncontradanaLista) {
            // Verifica se o código do voo na reserva corresponde ao voo recebido
            if (
              reservaEncontradanaLista.codigoVoo === this.vooRecebido.codigoVoo
            ) {
              this.reserva = reservaEncontradanaLista;
              this.reservaEncontrada = true;
              this.reservaNaoEncontrada = false;
            } else {
              // A reserva não pertence ao voo recebido
              this.reservaNaoEncontrada = true;
              this.reservaEncontrada = false;
            }
          } else {
            // Nenhuma reserva com o código foi encontrada
            this.reservaNaoEncontrada = true;
            this.reservaEncontrada = false;
          }
        }
      },
      error: (err) => {
        console.log('Erro ao carregar reservas da base de dados:', err);
      },
    });
  }

  confirmaReserva() {
    this.reserva.estadoReserva = 'embarcado';
    this.reservaService.putReserva(this.reserva).subscribe({
      next: (response) => {
        if (response) {
          alert(
            'Reserva alterada com sucesso! Status da Reserva: ' +
              this.reserva.estadoReserva
          );
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
