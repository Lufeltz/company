import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';

@Component({
  selector: 'app-r09-consultar-reserva',
  standalone: true,
  imports: [],
  templateUrl: './r09-consultar-reserva.component.html',
  styleUrl: './r09-consultar-reserva.component.css'
})
export class R09ConsultarReservaComponent {
  constructor(
    private reservaService: ReservasService,
  ) {}
}
