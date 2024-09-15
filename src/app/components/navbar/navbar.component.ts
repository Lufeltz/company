import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../services/remover-em-breve/login.service';
import { UsuarioResponseDto } from '../../shared/models/remover-em-breve/dto/usuario-response-dto.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router, private loginService: LoginService) {}

  sair() {
    this.router.navigate(['/login']);
  }

  get usuarioLogado(): UsuarioResponseDto | null {
    return this.loginService.usuarioLogado;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  temPermissao(...perfis: string[]): boolean {
    let usu = this.usuarioLogado;
    if (usu != null && perfis.length > 0) {
      for (let p of perfis) {
        if (usu.tipoPermissao.indexOf(p) != -1) {
          return true;
        }
      }
    }
    return false;
  }
}
