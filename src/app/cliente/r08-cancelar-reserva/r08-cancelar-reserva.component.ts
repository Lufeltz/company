import { Component } from '@angular/core';
import { AlteracaoEstadoReservasService } from '../../services/prototipo/alteracao-estado-reservas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r08-cancelar-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r08-cancelar-reserva.component.html',
  styleUrl: './r08-cancelar-reserva.component.css'
})
export class R08CancelarReservaComponent {
  constructor(
    private reservaService: AlteracaoEstadoReservasService,
  ) {}
}
