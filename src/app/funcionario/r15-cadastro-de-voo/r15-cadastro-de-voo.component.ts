import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-r15-cadastro-de-voo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './r15-cadastro-de-voo.component.html',
  styleUrl: './r15-cadastro-de-voo.component.css'
})
export class R15CadastroDeVooComponent {
  voo = {
    id: '',
    codigoVoo: '',
    dataHora: '',
    aeroportoOrigem: '',
    aeroportoDestino: '',
    valorPassagemReais: 0,
    quantidadePoltronasTotal: 0,
    quantidadePoltronasOcupadas: 0,
  };

  constructor(
    private voosService: VoosService
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.voosService.postVoo(this.voo);
    }
  }
}
