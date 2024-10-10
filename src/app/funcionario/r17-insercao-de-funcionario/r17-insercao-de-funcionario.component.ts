import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';
import { NumericoDirective } from '../../shared/directives/numerico.directive';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuncionarioService } from '../../services/prototipo/funcionarios.service';
import { Router } from '@angular/router';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';
import { FuncionarioSemId } from '../../shared/models/prototipo/funcionario-sem-id.model';

@Component({
  selector: 'app-r17-insercao-de-funcionario',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
    NgxMaskDirective,
    NumericoDirective,
    LetrasSomenteDirective,
  ],
  templateUrl: './r17-insercao-de-funcionario.component.html',
  styleUrl: './r17-insercao-de-funcionario.component.css',
})
export class R17InsercaoDeFuncionarioComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() adicaoConcluida = new EventEmitter<void>();
  @ViewChild('formAdicionarFuncionario') formAdicionarFuncionario!: NgForm;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  funcionarios: Funcionario[] = [];
  novoFuncionario: boolean = true;
  funcionario: Funcionario = new Funcionario();
  funcionarioSemId: FuncionarioSemId = new FuncionarioSemId();
  id!: string;
  loading!: boolean;
  mensagem: string = '';
  mensagem_detalhes: string = '';
  botaoDesabilitado: boolean = false;

  ngOnInit(): void {
    this.loading = false;
    this.novoFuncionario = !this.id;
  }

  adicionar(): void {
    this.loading = true;
    if (this.formAdicionarFuncionario.form.valid) {
      if (this.novoFuncionario) {
        this.funcionarioService.postFuncionario(this.funcionarioSemId).subscribe({
          next: (funcionario) => {
            this.loading = false;
            this.router.navigate(['/gerenciar-funcionarios']);
          },
          error: (err) => {
            this.loading = false;
            this.mensagem = `Erro inserindo funcionario ${this.funcionario.nome}`;
            if (err.status == 409) {
              this.mensagem_detalhes = `[${err.status}] ${err.message}`;
            }
          },
        });
      }
    } else {
      this.loading = false;
    }
    this.adicaoConcluida.emit();
    this.listarFuncionarios();
  }

  listarFuncionarios(): Funcionario[] {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: Funcionario[] | null) => {
        this.funcionarios = data ? data : [];
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
  dataNascimentoFuncionario: Date | null = null;
  senhaFuncionario: string = '';

  valueInvalid: boolean = false;

  formattedDataNascimento: string = '';

  cancelar(): void {
    this.voltarClicked.emit();
  }

  diasParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }
}
