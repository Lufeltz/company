import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r14-realizacao-do-voo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r14-realizacao-do-voo.component.html',
  styleUrl: './r14-realizacao-do-voo.component.css'
})
export class R14RealizacaoDoVooComponent {
  constructor(
    private voos: VoosService
  ) {}
}
