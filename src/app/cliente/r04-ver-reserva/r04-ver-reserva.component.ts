import { Component, Input } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';

@Component({
  selector: 'app-r04-ver-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r04-ver-reserva.component.html',
  styleUrl: './r04-ver-reserva.component.css'
})
export class R04VerReservaComponent {
  @Input() reserva!: { reserva: Reserva; voo: Voo | undefined };

  constructor(
    public activeModal: NgbActiveModal,
    private reservaService: ReservasService
  ) {}
}
