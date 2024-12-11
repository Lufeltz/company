import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MilhasService } from '../../services/prototipo/milhas.service';
import { Milha } from '../../shared/models/prototipo/milha.model';
import { VoosService } from '../../services/prototipo/voos.service';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { PipeDinheiroBRPipe } from '../../shared/pipes/pipe-dinheiro-br.pipe';
import { MilhasGatewayService } from '../../services/api-gateway/milhas-gateway.service';
import { MilhaDetalhesGateway } from '../../shared/models/api-gateway/milha-detalhes-gateway.model';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';
import { MilhaGateway } from '../../shared/models/api-gateway/milha-gateway.model';

@Component({
  selector: 'app-r06-consultar-extrato-milhas',
  standalone: true,
  imports: [CommonModule, PipeDinheiroBRPipe],
  templateUrl: './r06-consultar-extrato-milhas.component.html',
  styleUrls: ['./r06-consultar-extrato-milhas.component.css'],
})
export class R06ConsultarExtratoMilhasComponent implements OnInit {
  totalMilhas: number = 0;
  milhas: Milha[] = [];
  voos: Voo[] = [];
  loading: boolean = false;
  mensagemErro: string = '';

  milhaDetalhes: MilhaDetalhesGateway | null = null;
  entradas: MilhaGateway[] = [];
  saidas: MilhaGateway[] = [];

  selectedTab: string = 'compras';

  constructor(
    private milhasGatewayService: MilhasGatewayService,
    private authGatewayService: AuthGatewayService
  ) {}

  ngOnInit() {
    this.consultarExtrato();
  }

  consultarExtrato(): void {
    const usuario = this.authGatewayService.getUser();
    if (usuario) {
      const role = this.authGatewayService.getRoleFromToken();

      let idUsuario: number | null = null;

      if (role === 'CLIENTE' && 'idCliente' in usuario) {
        idUsuario = Number(usuario.idCliente);
      } else if (role === 'FUNCIONARIO' && 'idFuncionario' in usuario) {
        idUsuario = Number(usuario.idFuncionario);
      }

      this.loading = true;
      if (idUsuario !== null) {
        this.milhasGatewayService.consultarExtrato(idUsuario).subscribe(
          (data) => {
            this.milhaDetalhes = data;
            if (this.milhaDetalhes && this.milhaDetalhes.listaMilhas) {
              this.entradas = this.milhaDetalhes.listaMilhas.filter(
                (milha) => milha.tipoTransacao === 'ENTRADA'
              );
              this.saidas = this.milhaDetalhes.listaMilhas.filter(
                (milha) => milha.tipoTransacao === 'SAIDA'
              );
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            console.error('Erro ao consultar extrato de milhas', error);
            this.mensagemErro = `Erro ao carregar as milhas`;
          }
        );
      }
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
