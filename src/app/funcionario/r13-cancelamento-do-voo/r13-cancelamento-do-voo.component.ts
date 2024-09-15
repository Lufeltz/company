import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';

@Component({
  selector: 'app-r13-cancelamento-do-voo',
  standalone: true,
  imports: [],
  templateUrl: './r13-cancelamento-do-voo.component.html',
  styleUrl: './r13-cancelamento-do-voo.component.css'
})
export class R13CancelamentoDoVooComponent {
  constructor(
    private voos: VoosService
  ) {}
}
