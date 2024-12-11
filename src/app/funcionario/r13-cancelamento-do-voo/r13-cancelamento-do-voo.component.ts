import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';
import { StateService } from '../../services/api-gateway/state.service';

@Component({
  selector: 'app-r13-cancelamento-do-voo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r13-cancelamento-do-voo.component.html',
  styleUrl: './r13-cancelamento-do-voo.component.css',
})
export class R13CancelamentoDoVooComponent {
  @Input() vooRecebido!: any; // Aqui pode ser Voo, mas se for outro tipo, ajuste conforme necessário.
  @Output() voltarClicked = new EventEmitter<void>();

  constructor(
    public activeModal: NgbActiveModal, // Para fechar o modal
    private vooGatewayService: VooGatewayService,
    private stateService: StateService
  ) {}

  cancelarVoo(): void {
    console.log(this.vooRecebido.codigoVoo);
    this.vooGatewayService.cancelarVoo(this.vooRecebido.codigoVoo).subscribe({
      next: (response) => {
        if (response) {
          console.log('Voo cancelado com sucesso!');
          // Fechar o modal após o sucesso
          // this.activeModal.close(); // Fecha o modal
          this.voltarClicked.emit(); // Fecha o modal
          // this.stateService.triggerUpdateListagemVoosFuncionarios();
        } else {
          console.log('Falha ao cancelar voo');
        }
      },
      error: (err) => {
        console.log('Erro ao tentar cancelar voo:', err);
        // Você pode fechar o modal também em caso de erro, se necessário
        // this.activeModal.close(); // Fechando modal no erro (opcional)
        this.voltarClicked.emit(); // Fecha o modal
        // this.stateService.triggerUpdateListagemVoosFuncionarios();
      },
    });
  }
}
