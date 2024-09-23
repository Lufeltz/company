import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r12-confirmacao-embarque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r12-confirmacao-embarque.component.html',
  styleUrl: './r12-confirmacao-embarque.component.css'
})
export class R12ConfirmacaoEmbarqueComponent {
  constructor(
    private voos: VoosService
  ) {}
}
