import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { R02EfetuarLoginLogoutComponent } from './cliente/r02-efetuar-login-logout/r02-efetuar-login-logout.component';
import { PageNotFoundComponent } from './components/page-not-found';
import { NavbarComponent } from './components/navbar';
import { R03MostrarTelaInicialClienteComponent } from './cliente/r03-mostrar-tela-inicial-cliente/r03-mostrar-tela-inicial-cliente.component';
import { R04VerReservaComponent } from './cliente/r04-ver-reserva/r04-ver-reserva.component';
import { R05ComprarMilhasComponent } from './cliente/r05-comprar-milhas/r05-comprar-milhas.component';
import { R06ConsultarExtratoMilhasComponent } from './cliente/r06-consultar-extrato-milhas/r06-consultar-extrato-milhas.component';
import { R07EfetuarReservaComponent } from './cliente/r07-efetuar-reserva/r07-efetuar-reserva.component';
import { R08CancelarReservaComponent } from './cliente/r08-cancelar-reserva/r08-cancelar-reserva.component';
import { R09ConsultarReservaComponent } from './cliente/r09-consultar-reserva/r09-consultar-reserva.component';
import { R10FazerCheckInComponent } from './cliente/r10-fazer-check-in/r10-fazer-check-in.component';
import { R11TelaInicialFuncionarioComponent } from './funcionario/r11-tela-inicial-funcionario/r11-tela-inicial-funcionario.component';
import { R12ConfirmacaoEmbarqueComponent } from './funcionario/r12-confirmacao-embarque/r12-confirmacao-embarque.component';
import { R13CancelamentoDoVooComponent } from './funcionario/r13-cancelamento-do-voo/r13-cancelamento-do-voo.component';
import { R14RealizacaoDoVooComponent } from './funcionario/r14-realizacao-do-voo/r14-realizacao-do-voo.component';
import { R15CadastroDeVooComponent } from './funcionario/r15-cadastro-de-voo/r15-cadastro-de-voo.component';
import { R16ListagemDeFuncionariosComponent } from './funcionario/r16-listagem-de-funcionarios/r16-listagem-de-funcionarios.component';
import { R17InsercaoDeFuncionarioComponent } from './funcionario/r17-insercao-de-funcionario/r17-insercao-de-funcionario.component';
import { R18AlteracaoDeFuncionarioComponent } from './funcionario/r18-alteracao-de-funcionario/r18-alteracao-de-funcionario.component';
import { R19RemocaoDeFuncionarioComponent } from './funcionario/r19-remocao-de-funcionario/r19-remocao-de-funcionario.component';
import { CadastroComponent } from './auth/cadastro';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      //angular
      CommonModule,
      RouterOutlet,

      //auth
      R02EfetuarLoginLogoutComponent,
      CadastroComponent,


      //cliente-pages

      R03MostrarTelaInicialClienteComponent,
      R04VerReservaComponent,
      R05ComprarMilhasComponent,
      R06ConsultarExtratoMilhasComponent,
      R07EfetuarReservaComponent,
      R08CancelarReservaComponent,
      R09ConsultarReservaComponent,
      R10FazerCheckInComponent,

      //funcionario-pages
      R11TelaInicialFuncionarioComponent,
      R12ConfirmacaoEmbarqueComponent,
      R13CancelamentoDoVooComponent,
      R14RealizacaoDoVooComponent,
      R15CadastroDeVooComponent,
      R16ListagemDeFuncionariosComponent,
      R17InsercaoDeFuncionarioComponent,
      R18AlteracaoDeFuncionarioComponent,
      R19RemocaoDeFuncionarioComponent,
      

      //components
      PageNotFoundComponent,
      NavbarComponent,
    ]
})

export class AppComponent {
  title = 'Empresa Aérea';
  showNavbar: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/cadastro'].includes(event.url);
      }
    });
  }

}
