import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-success-checkin',
  standalone: true,
  imports: [],
  templateUrl: './modal-success-checkin.component.html',
  styleUrl: './modal-success-checkin.component.css'
})
export class ModalSuccessCheckinComponent {
  
  constructor(public activeModal: NgbActiveModal){

  }
}
