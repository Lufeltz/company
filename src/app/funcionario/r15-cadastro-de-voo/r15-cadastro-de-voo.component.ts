import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';

@Component({
  selector: 'app-r15-cadastro-de-voo',
  standalone: true,
  imports: [],
  templateUrl: './r15-cadastro-de-voo.component.html',
  styleUrl: './r15-cadastro-de-voo.component.css'
})
export class R15CadastroDeVooComponent {
  constructor(
    private voos: VoosService
  ) {}
}
