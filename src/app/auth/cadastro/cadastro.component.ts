import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';
// import { Cliente } from '../../shared/models/remover-em-breve/cliente.model';
import { EnderecoService } from '../../services/remover-em-breve/endereco.service';
// import { Usuario } from '../../shared/models/remover-em-breve/usuario.model';
import { Endereco } from '../../shared/models/remover-em-breve/endereco.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NgxMaskDirective, LetrasSomenteDirective],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent {
  @ViewChild('formCadastro') formCadastro!: NgForm;
  cadastroCPF: string = '';
  cadastroTelefone: string = '';
  cadastroEmail: string = '';
  cadastroNome: string = '';
  cadastroCep: string = '';
  cadastroUf: string = '';
  cadastroCidade: string = '';
  cadastroBairro: string = '';
  cadastroRua: string = '';
  cadastroNumero: string = '';
  cadastroComplemento: string = '';
  // private cliente: Cliente = new Cliente();
  // private usuario : Usuario = new Usuario();
  private endereco : Endereco = new Endereco();
  

  constructor(
    // private clienteService: ClienteService,
    private enderecoService: EnderecoService
  ) {}

  cadastro() {
    if (this.formCadastro.form.valid) {
      // this.cliente.cpf = this.cadastroCPF;
      // this.cliente.telefone = this.cadastroTelefone;
      // this.usuario.email = this.cadastroEmail;
      // this.usuario.nome = this.cadastroNome;
      // this.usuario.permissao.tipoPermissao = 'CLIENTE';
      // this.usuario.permissao.idPermissao = 1;
      this.endereco.cep = this.cadastroCep;
      this.endereco.uf = this.cadastroUf;
      this.endereco.cidade = this.cadastroCidade;
      this.endereco.bairro = this.cadastroBairro;
      this.endereco.rua = this.cadastroRua;
      this.endereco.numero = this.cadastroNumero;
      this.endereco.complemento = this.cadastroComplemento;
      // this.cliente.usuario = this.usuario;
      // this.cliente.endereco = this.endereco;
      // this.clienteService.cadastrar(this.cliente).subscribe({
      //   next: (cliente) => {
      //     alert('Cadastro realizado com sucesso!');
      //   },
      //   error: (err) => {
      //     console.log('Erro ao cadastrar cliente', err);
      //     alert('Erro ao cadastrar cliente');
      //   },
      // });
    }
  }

  consultarCEP(cep: string | undefined) {
    if (cep && cep.length === 8) {
      this.enderecoService.consultar(cep).subscribe({
        next: (endereco) => {
          if (endereco) {
            this.cadastroUf = endereco.uf ?? '';
            this.cadastroCidade = endereco.cidade ?? '';
            this.cadastroBairro = endereco.bairro ?? '';
            this.cadastroRua = endereco.rua ?? '';
          } else {
            alert('CEP não encontrado!');
            this.limparCamposEndereco();
          }
        },
        error: (err) => {
          alert('Serviço de consulta de CEP indisponível.');
          this.limparCamposEndereco();
        },
      });
    } else {
      alert('CEP inválido.');
      this.limparCamposEndereco();
    }
  }

  private limparCamposEndereco() {
    this.cadastroUf = '';
    this.cadastroCidade = '';
    this.cadastroBairro = '';
    this.cadastroRua = '';
  }
}
