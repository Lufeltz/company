import { Component, Input } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';

@Component({
  selector: 'app-r04-ver-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r04-ver-reserva.component.html',
  styleUrl: './r04-ver-reserva.component.css'
})
export class R04VerReservaComponent {
  @Input() reserva!: ReservaGateway

  constructor(
    public activeModal: NgbActiveModal,
    private reservaGatewayService: ReservaGatewayService
  ) {}
}
