import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Voo } from '../../../../shared/models/prototipo/voo.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-modal-checkin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-checkin.component.html',
  styleUrl: './modal-checkin.component.css'
})
export class ModalCheckinComponent {
  voo: Voo = new Voo;
  dia: string = "";
  hora: string = "";
  confirmacao: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void{
      this.formatarDataHora();
  }

  confirmar() {
    this.activeModal.close('confirmed');
  }

  formatarDataHora(): void {
      const partesDataHora = this.voo.dataHora.split("T");
      const partesData = partesDataHora[0].split("-");
      this.dia = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
      this.hora = partesDataHora[1].split("Z")[0].substring(0, 5); 
  }

}
