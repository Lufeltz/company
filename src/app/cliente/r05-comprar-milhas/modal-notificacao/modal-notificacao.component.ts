import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-notificacao',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './modal-notificacao.component.html',
  styleUrls: ['./modal-notificacao.component.css']
})
export class ModalNotificacaoComponent {
  @Input() mensagem: string = '';
  @Input() tipo: 'sucesso' | 'erro' = 'sucesso';

  constructor(public activeModal: NgbActiveModal) {}

  onClose() {
    this.activeModal.close();
  }
}
