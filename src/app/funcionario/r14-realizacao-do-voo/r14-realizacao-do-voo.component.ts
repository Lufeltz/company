import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';
import { StateService } from '../../services/api-gateway/state.service';

@Component({
  selector: 'app-r14-realizacao-do-voo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r14-realizacao-do-voo.component.html',
  styleUrl: './r14-realizacao-do-voo.component.css',
})
export class R14RealizacaoDoVooComponent {
  @Input() vooRecebido!: Voo;
  @Output() voltarClicked = new EventEmitter<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private vooGatewayService: VooGatewayService,
    private stateService: StateService
  ) {}

  realizarVoo(): void {
    console.log(this.vooRecebido.codigoVoo);
    this.vooGatewayService.realizarVoo(this.vooRecebido.codigoVoo).subscribe({
      next: (response) => {
        if (response) {
          console.log('Voo realizado com sucesso!');

          this.voltarClicked.emit();
        } else {
          console.log('Falha ao realizar voo');
        }
      },
      error: (err) => {
        console.log('Erro ao tentar realizar voo:', err);

        this.voltarClicked.emit();
      },
    });
  }
}
