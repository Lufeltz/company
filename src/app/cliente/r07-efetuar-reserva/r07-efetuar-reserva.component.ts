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
  aeroportos: any[] | null = [];

  voosAtuais: VooGateway[] = [];

  aeroportoOrigem: string = '';
  aeroportoDestino: string = '';

  constructor(
    private vooGatewayService: VooGatewayService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        this.aeroportos = data;
      },
      (error) => {
        console.error('Erro ao carregar aeroportos', error);
      }
    );
  }

  isFormValid(): boolean {
    return (
      this.aeroportoOrigem.trim() !== '' && this.aeroportoDestino.trim() !== ''
    );
  }

  selecionarVoo(voo: VooGateway, event: Event): void {
    event.preventDefault();
    this.router.navigate(['efetuar-reserva-2'], {
      state: { vooSelecionado: voo },
    });
  }
}
