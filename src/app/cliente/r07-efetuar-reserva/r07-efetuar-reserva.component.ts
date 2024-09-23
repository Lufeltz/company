import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r07-efetuar-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r07-efetuar-reserva.component.html',
  styleUrl: './r07-efetuar-reserva.component.css',
})
export class R07EfetuarReservaComponent {
  constructor(private reservaService: ReservasService) {}
}
