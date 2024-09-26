import { Component } from '@angular/core';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { VoosService } from '../../services/prototipo/voos.service';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { R04VerReservaComponent } from '../r04-ver-reserva/r04-ver-reserva.component';
import { LoginService } from '../../services/prototipo/login.service';
import { Usuario } from '../../shared/models/prototipo/usuario.model';

@Component({
  selector: 'app-r03-mostrar-tela-inicial-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r03-mostrar-tela-inicial-cliente.component.html',
  styleUrl: './r03-mostrar-tela-inicial-cliente.component.css'
})
export class R03MostrarTelaInicialClienteComponent {
  private reservas: Reserva[] = [];
  private voos: Voo[] = [];
  private reservasComVoos: { reserva: Reserva; voo: Voo | undefined }[] = [];
  private usuario: Usuario = new Usuario();

  constructor(
    private clienteService: ClientesService,
    private modalService: NgbModal,
    private loginService: LoginService,
    private reservasService: ReservasService,
    private voosService: VoosService,
  ) {}

  ngOnInit(): void {
    this.loadReservas();
    this.usuario = this.loginService.getUsuarioLogado();
  }

  loadReservas(): Reserva[] {
    this.reservasService.getAllReservas().subscribe({
      next: (data: Reserva[] | null) => {
        if (data == null) {
          this.reservas = [];
        } else {
          this.reservas = data;
          this.loadVoos();
        }
      },
      error: (err) => {
        console.log('Erro ao carregar reservas da base de dados');
      },
    });
    return this.reservas;
  }

  loadVoos(): Voo[] {
    this.voosService.getAllVoos().subscribe({
      next: (data: Voo[] | null) => {
        if (data == null) {
          this.voos = [];
        } else {
          this.voos = data;
          this.associarReservasComVoos();
        }
      },
      error: (err) => {
        console.log('Erro ao carregar voos da base de dados');
      },
    });

    return this.voos;
  }

  associarReservasComVoos(): void {
    this.reservasComVoos = this.reservas.map(reserva => {
      const vooRelacionado = this.voos.find(voo => voo.codigoVoo === reserva.codigoVoo);
      return { reserva, voo: vooRelacionado };
    });
  }

  visualizarReserva(reserva: { reserva: Reserva; voo: Voo | undefined }): void{
    const modalRef = this.modalService.open(R04VerReservaComponent);
    modalRef.componentInstance.reserva = reserva;
  }

  cancelarReserva(reserva: Reserva): void {
    //
  }

  get listReservasComVoos(): { reserva: Reserva; voo: Voo | undefined }[] {
    return this.reservasComVoos;
  }

  get exibeLista(): boolean{
    if(this.reservas[0] == null){
      return true;
    } else {
      return false;
    }
  }

  get saldo(): number{  //ligar login com a base de clientes posteriormente
    return 1200; 
  }

}
