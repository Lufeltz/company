import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r04-ver-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r04-ver-reserva.component.html',
  styleUrl: './r04-ver-reserva.component.css'
})
export class R04VerReservaComponent {
  constructor(
    private reservaService: ReservasService,
  ) {}
}
