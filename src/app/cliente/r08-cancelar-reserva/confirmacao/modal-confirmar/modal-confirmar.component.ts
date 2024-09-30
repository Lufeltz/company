import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmar.component.html',
  styleUrl: './modal-confirmar.component.css'
})
export class ModalConfirmarComponent {

  constructor(public activeModal: NgbActiveModal) {}

  confirmar() {
    this.activeModal.close('confirmed');
  }

  cancelar() {
    this.activeModal.dismiss('cancelled');
  }
}

