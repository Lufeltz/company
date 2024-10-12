import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { LoginService } from '../../services/prototipo/login.service';

@Component({
  selector: 'app-r07-efetuar-reserva-02',
  standalone: true,
  imports: [],
  templateUrl: './r07-efetuar-reserva-02.component.html',
  styleUrl: './r07-efetuar-reserva-02.component.css',
})
export class R07EfetuarReserva02Component implements OnInit {
  vooSelecionado!: Voo;
  private usuario: Usuario = new Usuario();
  private cliente: Cliente = new Cliente();

  qntMilhasCliente: number = 0;

  constructor(
    private router: Router,
    private clienteService: ClientesService,
    private loginService: LoginService
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
}