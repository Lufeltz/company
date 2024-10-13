import { Component, OnInit } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { R12ConfirmacaoEmbarqueComponent } from '../r12-confirmacao-embarque/r12-confirmacao-embarque.component';

@Component({
  selector: 'app-r11-tela-inicial-funcionario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './r11-tela-inicial-funcionario.component.html',
  styleUrl: './r11-tela-inicial-funcionario.component.css',
})
export class R11TelaInicialFuncionarioComponent implements OnInit {
  public voos: Voo[] = [];

  constructor(
    private voosService: VoosService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllvoos();
  }

  getAllvoos() {
    this.voosService.getAllVoos().subscribe({
      next: (data: Voo[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data;
        }
      },
      error: (err) => {
        console.log('Erro ao carregar voos');
      },
    });
  }

  //AÇÕES DOS BOTÕES

  abrirModalConfirmacaoEmbarque(voo: Voo) {
    const modalRef = this.modalService.open(R12ConfirmacaoEmbarqueComponent);
    modalRef.componentInstance.vooRecebido = voo;
  }
}
