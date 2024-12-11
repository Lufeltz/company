import { Component } from '@angular/core';
import { VoosService } from '../../services/prototipo/voos.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';
import { CadastroVooGateway } from '../../shared/models/api-gateway/cadastro-voo-gateway.model';

@Component({
  selector: 'app-r15-cadastro-de-voo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './r15-cadastro-de-voo.component.html',
  styleUrl: './r15-cadastro-de-voo.component.css',
})
export class R15CadastroDeVooComponent {
  loading: boolean = false;
  mensagemErro: string = '';

  voo: CadastroVooGateway = new CadastroVooGateway();
  aeroportos: any[] | null = [];

  constructor(private vooGatewayService: VooGatewayService) {}

  ngOnInit(): void {
    this.listarAeroportos();
  }

  listarAeroportos(): void {
    this.vooGatewayService.listarAeroportos().subscribe(
      (data) => {
        this.aeroportos = data;
      },
      (error) => {
        console.error('Erro ao carregar aeroportos', error);
      }
    );
  }

  cadastrarVoo(form: NgForm) {
    console.log(this.voo);
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        const control = form.controls[controlName];
        control.markAsTouched();
      });
      return;
    }

    const date = new Date(this.voo.dataHora);
    this.voo.dataHora = this.formatDateToISO(date);

    this.loading = true;
    this.vooGatewayService.cadastrarVoo(this.voo).subscribe({
      next: (vooCadastrado) => {
        this.loading = false;
        if (vooCadastrado) {
          console.log('Voo cadastrado com sucesso:', vooCadastrado);
          form.resetForm();
          this.voo = new CadastroVooGateway();
        } else {
          this.mensagemErro = 'Erro ao cadastrar voo.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao cadastrar voo:', err);
        this.mensagemErro = 'Erro ao cadastrar voo.';
      },
    });
  }

  formatDateToISO(date: Date): string {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      diff +
      pad(tzOffset / 60) +
      ':' +
      pad(tzOffset % 60)
    );
  }
}
