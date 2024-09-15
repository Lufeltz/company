import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';

@Component({
  selector: 'app-r04-ver-reserva',
  standalone: true,
  imports: [],
  templateUrl: './r04-ver-reserva.component.html',
  styleUrl: './r04-ver-reserva.component.css'
})
export class R04VerReservaComponent {
  constructor(
    private reservaService: ReservasService,
  ) {}
}
