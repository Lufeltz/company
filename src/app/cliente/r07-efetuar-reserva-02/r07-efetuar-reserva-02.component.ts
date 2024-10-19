import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { LoginService } from '../../services/prototipo/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { PipeDinheiroBRPipe } from '../../shared/pipes/pipe-dinheiro-br.pipe';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-r07-efetuar-reserva-02',
  standalone: true,
  imports: [CommonModule, FormsModule, PipeDinheiroBRPipe, NgxMaskDirective],
  templateUrl: './r07-efetuar-reserva-02.component.html',
  styleUrl: './r07-efetuar-reserva-02.component.css',
})
export class R07EfetuarReserva02Component implements OnInit {
  vooSelecionado!: Voo;
  private usuario: Usuario = new Usuario();
  private cliente: Cliente = new Cliente();
  private reserva: Reserva = new Reserva();

  qntMilhasCliente: number = 0;
  qntPassagens: number = 0;
  valorTotal: number = 0;
  valorMilhas: number = 0;

  qntMilhasPagamento: number = 0;
  qntMilhasSaldoFinal: number = 0;

  mostradados1: boolean = false;

  constructor(
    private router: Router,
    private clienteService: ClientesService,
    private loginService: LoginService,
    private reservaService: ReservasService
  ) {}

  ngOnInit(): void {
    // Recupera o voo selecionado a partir do estado
    this.vooSelecionado = history.state.vooSelecionado;

    // Caso o voo selecionado não seja encontrado (acesso direto à rota), redireciona de volta
    if (!this.vooSelecionado) {
      this.router.navigate(['/efetuar-reserva']);
    }

    this.getClienteByUser();
  }

  getClienteByUser(): void {
    this.usuario = this.loginService.getUsuarioLogado();
    let clientes: Cliente[] = [];
    this.clienteService.getAllClientes().subscribe({
      next: (data: Cliente[] | null) => {
        if (data == null) {
          clientes = [];
        } else {
          clientes = data;
          for (let i: number = 0; i < clientes.length; i++) {
            if (clientes[i].email.split('@')[0] === this.usuario.login) {
              // compara somente a primeira parte do email (que corresponde ao login)
              this.cliente = clientes[i];
              this.qntMilhasCliente = this.cliente.milhas;
              break;
            }
          }
        }
      },
      error: (err) => {
        console.log('Erro ao carregar clientes da base de dados');
      },
    });
  }

  calculaValorPassagem(): void {
    this.valorTotal =
      this.qntPassagens * this.vooSelecionado.valorPassagemReais;
    this.valorMilhas = this.valorTotal / 5;
  }

  pagarReserva(): void {
    this.qntMilhasSaldoFinal = this.valorTotal - this.qntMilhasPagamento * 5;
    this.mostradados1 = true;
  }

  gerarCodigoReserva(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';

    // Gerar três letras aleatórias
    let codigo = '';
    for (let i = 0; i < 3; i++) {
      const randomLetraIndex = Math.floor(Math.random() * letras.length);
      codigo += letras[randomLetraIndex];
    }

    // Gerar três números aleatórios
    for (let i = 0; i < 3; i++) {
      const randomNumeroIndex = Math.floor(Math.random() * numeros.length);
      codigo += numeros[randomNumeroIndex];
    }

    return codigo;
  }

  confirmaPagamento(): void {
    //atualiza o saldo de milhas do cliente
    this.cliente.milhas = this.cliente.milhas - this.qntMilhasPagamento;
    //solicita a atualização pro back
    this.clienteService.putCliente(this.cliente).subscribe({
      next: (response) => {
        if (response) {
          console.log('Cliente atualizado com sucesso:', response);
          this.router.navigate(['/homepage-cliente']);
        } else {
          console.log('Falha ao atualizar o cliente');
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar o cliente:', err);
      },
    });

    //faz a criação do objeto reserva e manda pro back cadastrar
    this.reserva.id = Date.now().toString(); // Retorna o timestamp atual como string
    this.reserva.codigoReserva = this.gerarCodigoReserva();
    this.reserva.codigoVoo = this.vooSelecionado.codigoVoo;
    this.reserva.dataHoraReserva = new Date().toString();
    this.reserva.estadoReserva = 'reservado';

    this.reservaService.postReserva(this.reserva).subscribe({
      next: (response) => {
        if (response) {
          alert(
            'Reserva criada com sucesso! Código da Reserva: ' +
              this.reserva.codigoReserva
          );
        } else {
          console.log('Falha ao criar a reserva.');
          alert('Falha ao criar a reserva. Tente novamente.');
        }
      },
      error: (err) => {
        console.error('Erro ao criar a reserva:', err);
        alert('Falha ao criar a reserva. Tente novamente.');
      },
    });
  }
}
