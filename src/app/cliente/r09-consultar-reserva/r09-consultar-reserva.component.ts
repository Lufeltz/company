import { Component, ViewChild } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientesService } from '../../services/prototipo/clientes.service';
import { LoginService } from '../../services/prototipo/login.service';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { Cliente } from '../../shared/models/prototipo/cliente.model';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { VoosService } from '../../services/prototipo/voos.service';
import { R08CancelarReservaComponent } from '../r08-cancelar-reserva/r08-cancelar-reserva.component';

@Component({
  selector: 'app-r09-consultar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './r09-consultar-reserva.component.html',
  styleUrl: './r09-consultar-reserva.component.css'
})
export class R09ConsultarReservaComponent {
  @ViewChild('formConsultaReserva') formConsultaReserva!: NgForm;
  codigoReserva?: string;
  reservaEncontrada?: boolean | null = null; 
  isPendente: boolean = false;
  isCancelavel: boolean = false;
  private usuario: Usuario = new Usuario();
  private cliente: Cliente = new Cliente();
  private reserva?: { reserva: Reserva; voo: Voo | undefined } = { reserva: {} as Reserva, voo: undefined };;

  constructor(
    private reservaService: ReservasService,
    private voosService: VoosService,
    private clienteService: ClientesService,
    private loginService: LoginService,
    private modalService: NgbModal
  ) {}

  getClienteByUser(): void{
    this.usuario = this.loginService.getUsuarioLogado();
    let clientes: Cliente[] = [];
    this.clienteService.getAllClientes().subscribe({
      next: (data: Cliente[] | null) => {
        if (data == null) {
          clientes = [];
        } else {
          clientes = data;
          for(let i: number = 0; i<clientes.length; i++){
            if(clientes[i].email.split('@')[0] === this.usuario.login){ 
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

  consultar(): void{
    if (this.formConsultaReserva.form.valid && this.codigoReserva) {
      let achou: boolean = false;
    if(this.codigoReserva != null){
    let reservas: Reserva[] = [];
    this.reservaService.getAllReservas().subscribe({
      next: (data: Reserva[] | null) => {
        if(data == null){
          reservas = [];
        } else {
          reservas = data;
          for(let i: number = 0; i<reservas.length; i++){
            if(reservas[i].codigoReserva === this.codigoReserva && this.reserva != null){ 
              this.reserva.reserva = reservas[i];
              achou = true;
              this.reservaEncontrada = true;
              if(reservas[i].estadoReserva == "pendente" || reservas[i].estadoReserva == "confirmada"){
                this.isCancelavel = true;
              } else {
                this.isCancelavel = false;
              }
              this.voosService.getAllVoos().subscribe({
                next:(data: Voo[] | null) => {
                  if(data == null){
                    if(this.reserva){
                    this.reserva.voo = undefined;
                    }
                  } else {
                    for(let i=0; i<data.length; i++){
                      if(data[i].codigoVoo == this.reserva?.reserva.codigoVoo){
                        this.reserva.voo = data[i];
                        let dataAtual = new Date(); // new Date("2024-09-17T15:30:00") <- PARA TESTE
                        if((dataAtual.getTime() - new Date(data[i].dataHora).getTime()) <= (48 * 60 * 60 * 1000) &&
                        this.reserva.reserva.estadoReserva != "cancelada" && this.reserva.reserva.estadoReserva != "confirmada"){
                          this.isPendente = true;
                        }
                        break;
                      }
                    }
                  }
                }, 
                error: (err) => {
                  console.log("Erro ao carregar voos da base de dados");
                }
              });
              break;
            }
          }
          if (!achou) {
            this.reservaEncontrada = false;
          }
        }
      },
      error: (err) => {
        console.log("Erro ao carregar reservas da base de dados");
      },
    });
  }}
  }

  cancelarReserva(reserva: { reserva: Reserva; voo: Voo | undefined } | null): void {
    const modalRef = this.modalService.open(R08CancelarReservaComponent);
    modalRef.componentInstance.reserva = reserva;
    modalRef.componentInstance.clienteLogado = this.cliente;
  }

  get Reserva(): { reserva: Reserva; voo: Voo | undefined } | null{
    if(this.reserva != null){
      return this.reserva;
    } else {
      return null;
    }
  }
  
}
