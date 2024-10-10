import {Component} from '@angular/core';
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
  loading: boolean = false;
  mensagemErro: string = '';

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
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        const control = form.controls[controlName];
        control.markAsTouched();
      });
      return;
    }

    if (form.form.valid) {
      this.loading = true;
      this.voosService.postVoo(this.voo).subscribe({
        next: (voo) => {
          console.log('Voo adicionado com sucesso!');
          this.loading = false;
          window.location.reload()
        },
        error: (err) => {
          console.error('Erro ao cadastrar voo', err);

          this.loading = false;
          this.mensagemErro = `Erro cadastrando voo`;
        },
      });
    }
  }
}
