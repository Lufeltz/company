import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';
import { FuncionarioService } from '../../services/prototipo/funcionarios.service';
import { Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-r19-remocao-de-funcionario',
  standalone: true,
  imports: [CommonModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './r19-remocao-de-funcionario.component.html',
  styleUrls: ['./r19-remocao-de-funcionario.component.css'],
})
export class R19RemocaoDeFuncionarioComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() exclusaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaExcluir!: Funcionario;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  funcionarios: Funcionario[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  excluir(): void {
    this.mensagem = '';
    this.mensagem_detalhes = '';

    if (this.funcionarioParaExcluir.id) {
      this.funcionarioService
        .deleteFuncionario(this.funcionarioParaExcluir.id)
        .subscribe({
          complete: () => {
            this.exclusaoConcluida.emit();
            this.listarFuncionarios();
          },
          error: (err) => {
            this.mensagem = `Erro removendo funcionario ${this.funcionarioParaExcluir.id} - ${this.funcionarioParaExcluir.nome}`;
            this.mensagem_detalhes = `[${err.status}] ${err.message}`;
          },
        });
    } else {
      this.mensagem = 'ID do funcionário não está definido.';
    }
  }

  listarFuncionarios(): Funcionario[] {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: Funcionario[] | null) => {
        if (data == null) {
          this.funcionarios = [];
        } else {
          this.funcionarios = data;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de usuários';
        this.mensagem_detalhes = `[${err.status}] ${err.message}`;
      },
    });
    return this.funcionarios;
  }

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: Date = new Date();
  senhaFuncionario: string = '';

  ngOnInit(): void {}

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  cancelar(): void {
    this.voltarClicked.emit();
  }
}
