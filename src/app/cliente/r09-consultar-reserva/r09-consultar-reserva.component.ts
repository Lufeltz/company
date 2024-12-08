import { Component, ViewChild } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { LoginService } from '../../services/prototipo/login.service';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { VoosService } from '../../services/prototipo/voos.service';
import { R08CancelarReservaComponent } from '../r08-cancelar-reserva/r08-cancelar-reserva.component';
import { ModalCheckinComponent } from '../r10-fazer-check-in/confirmacao/modal-checkin/modal-checkin.component';
import { ReservaGatewayService } from '../../services/api-gateway/reserva-gateway.service';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';

@Component({
  selector: 'app-r09-consultar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './r09-consultar-reserva.component.html',
  styleUrl: './r09-consultar-reserva.component.css',
})
export class R09ConsultarReservaComponent {
  @ViewChild('formConsultaReserva') formConsultaReserva!: NgForm;
  codigoReserva?: string;
  reservaEncontrada?: boolean | null = null;
  isPendente: boolean = false;
  isCancelavel: boolean = false;
  private usuario: Usuario = new Usuario();
  private cliente: Cliente = new Cliente();

  voo: VooGateway = new VooGateway();

  erro: string = '';

  reserva: ReservaGateway = new ReservaGateway();

  constructor(
    private reservaGatewayService: ReservaGatewayService,
    private clienteService: ClientesService,
    private loginService: LoginService,
    private modalService: NgbModal,
    private vooGatewayService: VooGatewayService
  ) {}

  // Método para consultar o voo
  consultarVoo(codigoVoo: string): void {
    this.vooGatewayService.getVooById(codigoVoo).subscribe(
      (response) => {
        if (response) {
          this.voo = response; // Atribui a resposta diretamente à variável 'voo'
          console.log('Detalhes do voo:', this.voo);
          // this.vooEncontrado = true; // Marca o voo como encontrado
        } else {
          this.erro = 'Voo não encontrado.'; // Caso não encontre o voo
          // this.vooEncontrado = false;
        }
      },
      (error) => {
        this.erro = 'Erro ao consultar o voo.'; // Caso ocorra algum erro
        // this.vooEncontrado = false;
        console.error('Erro ao consultar o voo', error);
      }
    );
  }

  // Método para consultar a reserva
  consultarReserva(codigoReserva: string): void {
    this.reservaGatewayService.consultarReserva(codigoReserva).subscribe(
      (response) => {
        if (response) {
          this.reserva = response; // Atribui a resposta diretamente à variável 'reserva'
          console.log('Detalhes da reserva:', this.reserva);
          if (this.reserva) {
            this.consultarVoo(this.reserva.voo.codigoVoo);
            console.log('Detalhes voo:', this.voo);
          }
          this.reservaEncontrada = true;
        } else {
          this.erro = 'Reserva não encontrada.';
        }
      },
      (error) => {
        this.erro = 'Erro ao consultar a reserva.';
        console.error('Erro ao consultar a reserva', error);
      }
    );
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
              this.cliente = clientes[i];
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

  cancelarReserva(
    reserva: { reserva: Reserva; voo: Voo | undefined } | null
  ): void {
    const modalRef = this.modalService.open(R08CancelarReservaComponent);
    modalRef.componentInstance.reserva = reserva;
    modalRef.componentInstance.clienteLogado = this.cliente;
  }

  fazerCheckIn(
    reserva: { reserva: Reserva; voo: Voo | undefined } | null
  ): void {
    // const modalRef = this.modalService.open(ModalCheckinComponent);
    // modalRef.componentInstance.voo = reserva?.voo;
  }

  // get Reserva(): { reserva: Reserva; voo: Voo | undefined } | null {
  //   if (this.reserva != null) {
  //     return this.reserva;
  //   } else {
  //     return null;
  //   }
  // }
}
