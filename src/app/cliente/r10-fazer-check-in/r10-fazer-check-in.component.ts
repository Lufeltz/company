import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { VoosService } from '../../services/prototipo/voos.service';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCheckinComponent } from './confirmacao/modal-checkin/modal-checkin.component';
import { ModalSuccessCheckinComponent } from './confirmacao/modal-success-checkin/modal-success-checkin.component';
import { AlteracaoEstadoReserva } from '../../shared/models/prototipo/alteracao-estado-reserva.model';
import { AlteracaoEstadoReservasService } from '../../services/prototipo/alteracao-estado-reservas.service';

@Component({
  selector: 'app-r10-fazer-check-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './r10-fazer-check-in.component.html',
  styleUrl: './r10-fazer-check-in.component.css'
})
export class R10FazerCheckInComponent {
  exibeLista: boolean = false;
  private reservas: Reserva[] = [];
  private voos: Voo[] = [];
  private reservasComVoos: { reserva: Reserva; voo: Voo | undefined }[] = [];
  private voosProximos: Voo[] = [];

  constructor(
    private reservasService: ReservasService,
    private voosService: VoosService,
    private modalService: NgbModal,
    private alteracaoEstadoReservaService: AlteracaoEstadoReservasService
  ){}

  ngOnInit(): void {
    this.loadReservas();
    //this.getClienteByUser();
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
    let dataAtual = new Date() // new Date("2024-09-30T15:30:00") <- PARA TESTE
    for(let i=0; i<this.reservasComVoos.length; i++){
      if(this.reservasComVoos[i].voo != undefined){
      if((new Date(this.reservasComVoos[i].voo!.dataHora).getTime() - dataAtual.getTime()) <= (48 * 60 * 60 * 1000) &&
      new Date(this.reservasComVoos[i].voo!.dataHora) >= dataAtual &&
      this.reservasComVoos[i].reserva.estadoReserva != "cancelada" && this.reservasComVoos[i].reserva.estadoReserva != "confirmada"){
        this.voosProximos.push(this.reservasComVoos[i].voo!);
        this.exibeLista = true;
      }}
    } 
  }

  formatarTempoEntreDatas(data: string): string {
    const dataInicial: Date = new Date() // new Date("2024-09-30T15:30:00") <- PARA TESTE
    const dataFinal = new Date(data); 
    const diferençaEmMs = dataFinal.getTime() - dataInicial.getTime(); 
  
    const segundos: number = diferençaEmMs / 1000; 
  
    const dias: number = Math.floor(segundos / (24 * 3600)); 
    const horas: number = Math.floor((segundos % (24 * 3600)) / 3600); 
    const minutos: number = Math.floor((segundos % 3600) / 60); 
  
    let partes: string[] = []; 
  
    if (dias > 0) partes.push(`${dias} dia${dias > 1 ? 's' : ''}`);
    if (horas > 0) partes.push(`${horas} hora${horas > 1 ? 's' : ''}`);
    if (minutos > 0) partes.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`);
  
    return partes.join(' e '); 
  }

  fazerCheckIn(voo: Voo): void{
    const modalRef = this.modalService.open(ModalCheckinComponent);
    modalRef.componentInstance.voo = voo;
    modalRef.result.then(
      (result) => {
        if (result === 'confirmed') {
          let reserva: Reserva | undefined = this.reservas.find(reserva => reserva.codigoVoo == voo.codigoVoo);
          if(reserva != undefined){
          let estadoResAnterior: string = reserva!.estadoReserva;
          //atualiza o estado da reserva para confirmada
          reserva!.estadoReserva = "confirmada";
          this.reservasService.putReserva(reserva!).subscribe(() => {    
            //cria um registro de alteração de reserva
            let registro: AlteracaoEstadoReserva = new AlteracaoEstadoReserva;
            registro.codigoReserva = reserva!.codigoReserva;
            registro.dataHoraAlteracao = new Date().toISOString();
            registro.estadoDestino = reserva!.estadoReserva;
            registro.estadoOrigem = estadoResAnterior;
            this.alteracaoEstadoReservaService.postAlteracaoEstadoReservas(registro).subscribe(()=>{});
          });
          const sucessoModalRef = this.modalService.open(ModalSuccessCheckinComponent);
        }} else {
          console.log("Erro ao associar voo com reserva correspondente");
        }
      },
      (reason) => {
        console.log('Checkin falhou');
      }
    );
  }

  get listVoosProximos(): Voo[] {
    return this.voosProximos;
  }


}
