import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';
import { Cadastro } from '../../shared/models/prototipo/cadastro.model';
import { AutocadastroService } from '../../services/prototipo/autocadastro.service';

@Component({
  selector: 'app-r01-autocadastro',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    NgxMaskDirective,
    LetrasSomenteDirective,
  ],
  templateUrl: './r01-autocadastro.component.html',
  styleUrl: './r01-autocadastro.component.css',
})
export class R01AutocadastroComponent {
  @ViewChild('formCadastro') formCadastro!: NgForm;
  cadastro: Cadastro = new Cadastro();
  mensagem!: string;
  mensagem_detalhes!: string;

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

  constructor(
    // private clienteService: ClienteService,
    // private enderecoService: EnderecoService
    private cadastroService: AutocadastroService,
    private router: Router
  ) {}

  cadastrarUsuario(): void {
    this.cadastroService.postCadastro(this.cadastro).subscribe({
      next: (usuario) => {
        this.router.navigate(['/gerenciar-funcionarios']);
      },
      error: (err) => {
        this.mensagem = `Erro inserindo funcionario ${this.cadastro.login}`;
        if (err.status == 409) {
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        }
      },
    });
  }
}
