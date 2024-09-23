import { Routes } from '@angular/router';
import { CadastroComponent } from './auth/cadastro';
import { PageNotFoundComponent } from './components/page-not-found';
import { authGuard } from './auth/auth.guard';
import { R16ListagemDeFuncionariosComponent } from './funcionario/r16-listagem-de-funcionarios/r16-listagem-de-funcionarios.component';
import { R03MostrarTelaInicialClienteComponent } from './cliente/r03-mostrar-tela-inicial-cliente/r03-mostrar-tela-inicial-cliente.component';
import { R05ComprarMilhasComponent } from './cliente/r05-comprar-milhas/r05-comprar-milhas.component';
import { R07EfetuarReservaComponent } from './cliente/r07-efetuar-reserva/r07-efetuar-reserva.component';
import { R10FazerCheckInComponent } from './cliente/r10-fazer-check-in/r10-fazer-check-in.component';
import { R06ConsultarExtratoMilhasComponent } from './cliente/r06-consultar-extrato-milhas/r06-consultar-extrato-milhas.component';
import { R09ConsultarReservaComponent } from './cliente/r09-consultar-reserva/r09-consultar-reserva.component';
import { R11TelaInicialFuncionarioComponent } from './funcionario/r11-tela-inicial-funcionario/r11-tela-inicial-funcionario.component';
import { R15CadastroDeVooComponent } from './funcionario/r15-cadastro-de-voo/r15-cadastro-de-voo.component';
import { R02EfetuarLoginLogoutComponent } from './cliente/r02-efetuar-login-logout/r02-efetuar-login-logout.component';

export const routes: Routes = [
  //default
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Rota padrão, se colocar o path do component em "redirectTo:", não precisará da tag/selector do seu component em app.component.html

  //auth
  // { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'login', title: 'Login', component: R02EfetuarLoginLogoutComponent },
  { path: 'cadastro', title: 'Cadastro', component: CadastroComponent },

  //cliente-pages
  {
    path: 'homepage-cliente',
    title: 'homepage-cliente',
    component: R03MostrarTelaInicialClienteComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'comprar-milhas',
    title: 'comprar-milhas',
    component: R05ComprarMilhasComponent,
    // canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'efetuar-reserva',
    title: 'efetuar-reserva',
    component: R07EfetuarReservaComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'fazer-check-in',
    title: 'fazer-check-in',
    component: R10FazerCheckInComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'consultar-extrato-milhas',
    title: 'consultar-extrato-milhas',
    component: R06ConsultarExtratoMilhasComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'consultar-reserva',
    title: 'consultar-reserva',
    component: R09ConsultarReservaComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },

  //funcionario-pages
  {
    path: 'homepage',
    title: 'Homepage',
    component: R11TelaInicialFuncionarioComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },

  {
    path: 'cadastro-voos',
    title: 'cadastro-voos',
    component: R15CadastroDeVooComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'gerenciar-funcionarios',
    title: 'GerenciarFuncionarios',
    component: R16ListagemDeFuncionariosComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },

  //components
  { path: '**', title: 'Error 404', component: PageNotFoundComponent }, // Rota para um component quando página der erro 404
];
