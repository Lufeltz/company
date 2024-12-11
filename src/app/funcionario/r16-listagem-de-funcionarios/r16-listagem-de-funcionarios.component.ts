import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FuncionarioService } from '../../services/prototipo/funcionarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';
import { R17InsercaoDeFuncionarioComponent } from '../r17-insercao-de-funcionario/r17-insercao-de-funcionario.component';
import { R18AlteracaoDeFuncionarioComponent } from '../r18-alteracao-de-funcionario/r18-alteracao-de-funcionario.component';
import { NgForm } from '@angular/forms';
import { R19RemocaoDeFuncionarioComponent } from '../r19-remocao-de-funcionario/r19-remocao-de-funcionario.component';
import { NgxMaskPipe } from 'ngx-mask';
import { FuncionarioGateway } from '../../shared/models/api-gateway/funcionario-gateway.model';
import { FuncionarioGatewayService } from '../../services/api-gateway/funcionario-gateway.service';
import { StateService } from '../../services/api-gateway/state.service';

@Component({
  selector: 'app-r16-listagem-de-funcionarios',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  templateUrl: './r16-listagem-de-funcionarios.component.html',
  styleUrl: './r16-listagem-de-funcionarios.component.css',
})
export class R16ListagemDeFuncionariosComponent {
  funcionarios: FuncionarioGateway[] = [];
  funcionariosGateway: FuncionarioGateway[] = [];
  mensagem: string = '';
  mensagem_detalhes = '';
  funcionariosIsPresent: boolean | any = null;
  @Input() funcionarioParaEditar!: FuncionarioGateway;
  @ViewChild('formEditarFuncionario') formEditarFuncionario!: NgForm;
  @Input() funcionarioParaExcluir!: FuncionarioGateway;

  constructor(
    private modalService: NgbModal,
    private funcionarioGatewayService: FuncionarioGatewayService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.listarFuncionariosGateway();

    this.stateService.updateFuncionarios$.subscribe(() => {
      this.listarFuncionariosGateway();
    });
  }

  listarFuncionariosGateway(): void {
    this.funcionarioGatewayService.getAllFuncionarios().subscribe({
      next: (data: FuncionarioGateway[] | null) => {
        if (data == null) {
          this.funcionariosGateway = [];
          this.funcionariosIsPresent = false;
        } else {
          this.funcionariosGateway = data;
          console.log('funcionarios gateway', this.funcionariosGateway);
          this.funcionariosIsPresent = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de funcionários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
  }

  listarFuncionarios(): FuncionarioGateway[] {
    this.funcionarioGatewayService.getAllFuncionarios().subscribe({
      next: (data: FuncionarioGateway[] | null) => {
        if (data == null) {
          this.funcionarios = [];
          this.funcionariosIsPresent = false;
        } else {
          this.funcionarios = data;
          this.funcionariosIsPresent = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de funcionários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  // CRIAÇÃO DOS MODAIS

  adicionar(): void {
    const modalRef = this.modalService.open(R17InsercaoDeFuncionarioComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.adicaoConcluida.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close();
    });
  }

  editar(funcionario: FuncionarioGateway) {
    this.funcionarioParaEditar = funcionario;
    const modalRef = this.modalService.open(
      R18AlteracaoDeFuncionarioComponent,
      {
        backdrop: 'static',
        centered: true,
      }
    );
    modalRef.componentInstance.funcionarioParaEditar =
      this.funcionarioParaEditar;
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.edicaoConcluida.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close();
    });
  }

  excluir(funcionario: FuncionarioGateway) {
    this.funcionarioParaExcluir = funcionario;
    const modalRef = this.modalService.open(R19RemocaoDeFuncionarioComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.funcionarioParaExcluir =
      this.funcionarioParaExcluir;

    modalRef.componentInstance.voltarClicked.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close();
    });

    modalRef.componentInstance.exclusaoConcluida.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close(); // Also close the modal when the deletion is completed
    });
  }
}
