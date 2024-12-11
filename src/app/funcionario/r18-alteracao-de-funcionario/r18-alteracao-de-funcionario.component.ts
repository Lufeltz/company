import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';
import { FuncionarioService } from '../../services/prototipo/funcionarios.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { FuncionarioGatewayService } from '../../services/api-gateway/funcionario-gateway.service';
import { FuncionarioGateway } from '../../shared/models/api-gateway/funcionario-gateway.model';
import { StateService } from '../../services/api-gateway/state.service';

@Component({
  selector: 'app-r18-alteracao-de-funcionario',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    LetrasSomenteDirective,
  ],
  templateUrl: './r18-alteracao-de-funcionario.component.html',
  styleUrl: './r18-alteracao-de-funcionario.component.css',
})
export class R18AlteracaoDeFuncionarioComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() edicaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaEditar!: FuncionarioGateway;
  @ViewChild('formEditarFuncionario') formEditarFuncionario!: NgForm;

  constructor(
    private funcionarioGatewayService: FuncionarioGatewayService,
    private stateService: StateService
  ) {}

  funcionarios: FuncionarioGateway[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  salvar(): void {
    if (this.formEditarFuncionario.form.valid) {
      this.funcionarioGatewayService
        .atualizarFuncionario(this.funcionarioParaEditar)
        .subscribe({
          next: (funcionario: FuncionarioGateway | null) => {
            this.voltarClicked.emit();
            this.stateService.triggerUpdateListagemFuncionarios();
          },
          error: (err) => {
            this.edicaoConcluida.emit();
            this.voltarClicked.emit();
            this.stateService.triggerUpdateListagemFuncionarios();
            console.log(this.funcionarioParaEditar);
            this.mensagem = `Erro atualizando funcionario ${this.funcionarioParaEditar.nome}`;
            this.mensagem_detalhes = `[${err.status}] ${err.message}`;
          },
        });
    }
  }

  listarFuncionarios(): FuncionarioGateway[] {
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
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  valueInvalid: boolean = false;

  ngOnInit(): void {}

  cancelar(): void {
    this.voltarClicked.emit();
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  formatarDiasUteisParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }
}
