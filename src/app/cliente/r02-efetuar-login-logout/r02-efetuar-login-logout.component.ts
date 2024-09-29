import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../../services/prototipo/usuarios.service';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../services/prototipo/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-r02-efetuar-login-logout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './r02-efetuar-login-logout.component.html',
  styleUrl: './r02-efetuar-login-logout.component.css',
})
export class R02EfetuarLoginLogoutComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensagem!: string;
  mensagem_detalhes!: string;
  message!: string;
  loginError: boolean = false;
  login: Usuario = new Usuario();
  @ViewChild('formLogin') formLogin!: NgForm;

  constructor(
    private usuarioService: UsuariosService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
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

  // Método para verificar se o login e a senha correspondem a um usuário no array
  validarLogin(login: string, senha: string) {
    return this.usuarios.find(
      (usuario) => usuario.login === login && usuario.senha === senha
    );
  }

  // Método logar
  logar(): void {
    if (this.formLogin.form.valid) {
      const usuario = this.validarLogin(this.login.login, this.login.senha);
      if (usuario) {
        console.log(`Usuário ${usuario.login} logado com sucesso!`);
        // Aqui você pode redirecionar o usuário para outra página ou realizar outras ações de login

        this.loginService.usuarioLogado = usuario;
        console.log(usuario)

        if (usuario.tipo.toUpperCase() == 'FUNCIONARIO') {
          this.router.navigate(['/homepage']);
        } else if (usuario.tipo.toUpperCase() == 'CLIENTE') {
          this.router.navigate(['/homepage-cliente']);
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        console.log('Login ou senha incorretos!');
      }
    }
  }
}
