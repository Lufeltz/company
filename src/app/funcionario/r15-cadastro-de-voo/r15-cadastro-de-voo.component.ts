import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import {LetrasSomenteDirective} from "../../shared/directives/letras-somente.directive";

@Component({
  selector: 'app-r15-cadastro-de-voo',
  standalone: true,
    imports: [CommonModule, LetrasSomenteDirective],
  templateUrl: './r15-cadastro-de-voo.component.html',
  styleUrl: './r15-cadastro-de-voo.component.css'
})
export class R15CadastroDeVooComponent {
  constructor(
    private voos: VoosService
  ) {}
}
