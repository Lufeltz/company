import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r15-cadastro-de-voo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r15-cadastro-de-voo.component.html',
  styleUrl: './r15-cadastro-de-voo.component.css'
})
export class R15CadastroDeVooComponent {
  constructor(
    private voos: VoosService
  ) {}
}
