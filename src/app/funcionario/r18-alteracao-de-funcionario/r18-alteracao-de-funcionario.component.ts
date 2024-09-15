import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';
import { FuncionarioService } from '../../services/prototipo/funcionarios.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-r18-alteracao-de-funcionario',
  standalone: true,
  imports: [   FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    LetrasSomenteDirective],
  templateUrl: './r18-alteracao-de-funcionario.component.html',
  styleUrl: './r18-alteracao-de-funcionario.component.css'
})
export class R18AlteracaoDeFuncionarioComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() edicaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaEditar!: Funcionario;
  @ViewChild('formEditarFuncionario') formEditarFuncionario!: NgForm;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  funcionarios: Funcionario[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  salvar(): void {
    if (this.formEditarFuncionario.form.valid) {
      // console.log(this.funcionarioParaEditar);
      this.funcionarioService
        .putFuncionario(this.funcionarioParaEditar)
        .subscribe({
          next: (funcionario: Funcionario | null) => {
            this.router.navigate(['/gerenciar-funcionarios']);
            this.edicaoConcluida.emit();
            this.listarFuncionarios();
          },
          error: (err) => {
            this.mensagem = `Erro atualizando funcionario ${this.funcionarioParaEditar.nome}`;
            this.mensagem_detalhes = `[${err.status}] ${err.message}`;
          },
        });
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
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: Date = new Date();
  senhaFuncionario: string = '';

  valueInvalid: boolean = false;

  ngOnInit(): void {
  }

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
