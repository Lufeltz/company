import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r09-consultar-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r09-consultar-reserva.component.html',
  styleUrl: './r09-consultar-reserva.component.css'
})
export class R09ConsultarReservaComponent {
  constructor(
    private reservaService: ReservasService,
  ) {}
}
