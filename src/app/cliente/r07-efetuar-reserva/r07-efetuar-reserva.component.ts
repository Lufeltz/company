import { Component } from '@angular/core';
import { ReservasService } from '../../services/prototipo/reservas.service';
import { CommonModule } from '@angular/common';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VooGatewayService } from '../../services/api-gateway/voo-gateway.service';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';

@Component({
  selector: 'app-r07-efetuar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './r07-efetuar-reserva.component.html',
  styleUrl: './r07-efetuar-reserva.component.css',
})
export class R07EfetuarReservaComponent {
  voos: Voo[] = [];
  mensagem: string = '';
  aeroportos: any[] | null = []; // Lista de aeroportos recebida do backend

  voosAtuais: VooGateway[] = [];

  //variaveis que armazenam valores dos inputs
  aeroportoOrigem: string = '';
  aeroportoDestino: string = '';

  constructor(
    private vooGatewayService: VooGatewayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Chama o serviço para listar os aeroportos
    this.listarAeroportos();
  }

  listarVoosAtuais(
    codigoAeroportoOrigem: string,
    codigoAeroportoDestino: string
  ): void {
    this.vooGatewayService
      .listarVoosAtuais(codigoAeroportoOrigem, codigoAeroportoDestino)
      .subscribe(
        (data) => {
          this.voosAtuais = data || [];
          console.log(this.voosAtuais);
        },
        (error) => {
          console.error('Erro ao listar voos atuais', error);
        }
      );
  }

  listarAeroportos(): void {
    this.vooGatewayService.listarAeroportos().subscribe(
      (data) => {
        this.aeroportos = data; // Preenche a lista de aeroportos com os dados recebidos
      },
      (error) => {
        console.error('Erro ao carregar aeroportos', error);
      }
    );
  }

  // Valida se os campos estão preenchidos
  isFormValid(): boolean {
    return (
      this.aeroportoOrigem.trim() !== '' && this.aeroportoDestino.trim() !== ''
    );
  }

  selecionarVoo(voo: VooGateway, event: Event): void {
    event.preventDefault(); // Previne o comportamento padrão do link
    this.router.navigate(['efetuar-reserva-2'], {
      state: { vooSelecionado: voo },
    });
  }
}
