import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/remover-em-breve/login.service';
import { Login } from '../../shared/models/remover-em-breve/login.model';
import { NumericoDirective } from '../../shared/directives/numerico.directive';
import { UsuarioRequestDto } from '../../shared/models/remover-em-breve/dto/usuario-request-dto.model';
import { ClienteService } from '../../services/remover-em-breve/cliente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NumericoDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  @ViewChild('formLogin') formLogin!: NgForm;
  login: UsuarioRequestDto = new UsuarioRequestDto();
  loading: boolean = false;
  message!: string;

  emailUser?: string;
  passwordUser?: string;
  loginUser: Login = new Login();
  loginError: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    if (this.loginService.usuarioLogado) {
      this.router.navigate(['/login']);
    } else {
      this.route.queryParams.subscribe((params) => {
        this.message = params['error'];
      });
    }
  }

  logar(): void {
    this.loading = true;
    if (this.formLogin.form.valid) {
      this.loginService.login(this.login).subscribe({
        next: (usu) => {
          if (usu != null) {

            this.loginService.usuarioLogado = usu;
            this.loading = false;
            if (usu.tipoPermissao == 'FUNCIONARIO') {
              this.router.navigate(['/homepage']);
            } else if (usu.tipoPermissao == 'CLIENTE') {
              this.clienteService.consultarPorIdUsuario(usu.idUsuario)
              this.router.navigate(['/homepage-cliente']);
            } else {
              this.router.navigate(['/login']);
            }
          } else {
            this.message = 'Usuário/Senha invállidos.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.message = `Erro efetuando login: ${err.message}`;
        },
      });
    } else {
      this.loading = false;
    }
  }

  clearLoginError() {
    this.loginError = false;
  }
}
