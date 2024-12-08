import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FuncionarioGatewayService } from '../../services/api-gateway/funcionario-gateway.service';
import { FuncionarioGateway } from '../../shared/models/api-gateway/funcionario-gateway.model';

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

  funcionarios: FuncionarioGateway[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(private funcionarioGatewayService: FuncionarioGatewayService) {}

  ngOnInit(): void {
    // this.listarFuncionarios(); // Carrega a lista de funcionários ao iniciar o componente
  }

  inativar(): void {
    this.mensagem = '';
    this.mensagem_detalhes = '';

    if (this.funcionarioParaExcluir.email) {
      this.funcionarioGatewayService
        .inativarFuncionario(this.funcionarioParaExcluir.email)
        .subscribe({
          next: () => {
            // console.log('Funcionario excluído com sucesso next');
            // this.exclusaoConcluida.emit(); // Emite o evento para o pai
            // this.voltarClicked.emit(); // Fecha o modal
          },
          error: (err) => {
            this.mensagem = `Erro removendo funcionário ${this.funcionarioParaExcluir.email} - ${this.funcionarioParaExcluir.nome}`;
            console.log('Funcionario excluído com sucesso error');
            this.mensagem_detalhes = `[${err.status}] ${err.message}`;
            this.exclusaoConcluida.emit(); // Emite o evento para o pai, mesmo em erro
            this.voltarClicked.emit(); // Fecha o modal
          },
        });
    } else {
      this.mensagem = 'Email do funcionário não está definido.';
    }
  }

  listarFuncionarios(): void {
    this.funcionarioGatewayService.getAllFuncionarios().subscribe({
      next: (data: FuncionarioGateway[] | null) => {
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
  }

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  cancelar(): void {
    this.voltarClicked.emit(); // Fecha o modal
  }
}
