import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';
import { ClienteGatewayService } from '../../services/api-gateway/cliente-gateway.service';
import { CadastroGateway } from '../../shared/models/api-gateway/cadastro-gateway.model';

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
  cadastro: CadastroGateway = new CadastroGateway();
  mensagem!: string;
  mensagem_detalhes!: string;

  constructor(
    // private clienteService: ClienteService,
    // private enderecoService: EnderecoService
    // private cadastroService: AutocadastroService,
    private router: Router,
    private clienteGatewayService: ClienteGatewayService
  ) {}

  cadastrarCliente(cliente: CadastroGateway) {
    this.clienteGatewayService.cadastrarCliente(cliente).subscribe({
      next: (clienteCadastrado) => {
        if (clienteCadastrado) {
          console.log('Cliente cadastrado com sucesso:', clienteCadastrado);
          this.router.navigate(['/login']);
        } else {
          console.log('Erro ao cadastrar cliente.');
        }
      },
      error: (err) => {
        console.error('Erro ao cadastrar cliente:', err);
        // Aqui você pode tratar o erro, como exibir uma mensagem de erro para o usuário
      },
    });
  }

  pesquisarCep(cep: string) {
    this.clienteGatewayService.consultarEndereco(cep).subscribe({
      next: (endereco) => {
        if (endereco) {
          // Preenche os campos de endereço com os dados retornados
          this.cadastro.endereco.rua = endereco.rua || '';
          this.cadastro.endereco.bairro = endereco.bairro || '';
          this.cadastro.endereco.cidade = endereco.cidade || '';
          this.cadastro.endereco.estado = endereco.estado || ''; // Atualiza o estado (UF)
          // Caso o endereço tenha complementos, pode ser ajustado aqui também
          this.cadastro.endereco.complemento = endereco.complemento || '';
        } else {
          console.error('Endereço não encontrado para o CEP fornecido.');
        }
      },
      error: (err) => {
        console.error('Erro ao consultar endereço:', err);
      },
    });
  }
}
