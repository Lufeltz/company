import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../../services/prototipo/usuarios.service';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginRequestGateway } from '../../shared/models/api-gateway/login-request-gateway.model';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';
import { TokenService } from '../../services/api-gateway/token.service';

@Component({
  selector: 'app-r02-efetuar-login-logout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './r02-efetuar-login-logout.component.html',
  styleUrls: ['./r02-efetuar-login-logout.component.css'],
})
export class R02EfetuarLoginLogoutComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensagem!: string;
  mensagem_detalhes!: string;
  message!: string;
  loginError: boolean = false;
  login: LoginRequestGateway = new LoginRequestGateway();
  @ViewChild('formLogin') formLogin!: NgForm;

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private authGatewayService: AuthGatewayService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getUsuarios();

    // Verifique se o usuário já está autenticado
    if (this.authGatewayService.isAuthenticated()) {
      const role = this.authGatewayService.getRoleFromToken();
      if (role === 'FUNCIONARIO') {
        this.router.navigate(['/homepage']);
      } else if (role === 'CLIENTE') {
        this.router.navigate(['/homepage-cliente']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  getUsuarios(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: Usuario[] | null) => {
        if (data == null) {
          this.usuarios = [];
        } else {
          this.usuarios = data;
          console.log(this.usuarios);
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de funcionários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
  }

  logar(): void {
    console.log(this.login);
    if (this.formLogin.form.valid) {
      this.authGatewayService.login(this.login).subscribe({
        next: (token) => {
          if (token) {
            console.log('Token recebido:', token);
            this.tokenService.setToken(token);

            // Chama loadUserData e aguarda a resposta
            this.authGatewayService.loadUserData().subscribe({
              next: () => {
                // Após o carregamento dos dados, faça o redirecionamento
                const role = this.authGatewayService.getRoleFromToken();
                console.log('role', role);
                if (role === 'FUNCIONARIO') {
                  this.router.navigate(['/homepage']);
                } else if (role === 'CLIENTE') {
                  this.router.navigate(['/homepage-cliente']);
                } else {
                  this.router.navigate(['/login']);
                }
              },
              error: (err) => {
                console.error('Erro ao carregar os dados do usuário:', err);
                this.loginError = true;
                this.message = 'Erro ao carregar dados do usuário após login.';
              },
            });
          }
        },
        error: (err) => {
          console.error('Erro ao realizar login:', err);
          this.loginError = true;
          this.message = 'Login ou senha incorretos!';
        },
      });
    }
  }
}
