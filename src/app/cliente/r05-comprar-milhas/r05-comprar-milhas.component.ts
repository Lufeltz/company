import { Component } from '@angular/core';
import { MilhasService } from '../../services/prototipo/milhas.service';

@Component({
  selector: 'app-r05-comprar-milhas',
  standalone: true,
  imports: [],
  templateUrl: './r05-comprar-milhas.component.html',
  styleUrl: './r05-comprar-milhas.component.css'
})
export class R05ComprarMilhasComponent {
  constructor(
    private milhasService: MilhasService,
  ) {}
}
