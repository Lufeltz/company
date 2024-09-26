import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r11-tela-inicial-funcionario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r11-tela-inicial-funcionario.component.html',
  styleUrl: './r11-tela-inicial-funcionario.component.css',
})
export class R11TelaInicialFuncionarioComponent {
  constructor(private voos: VoosService) {}
}
