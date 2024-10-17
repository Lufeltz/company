import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-cancelado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-cancelado.component.html',
  styleUrl: './modal-cancelado.component.css'
})
export class ModalCanceladoComponent {
  @Input() isCancelado: boolean = false;
  @Input() isOcorrido: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}
}
