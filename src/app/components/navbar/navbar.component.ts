import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../shared/models/prototipo/usuario.model';
import { LoginService } from '../../services/prototipo/login.service';


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

  get usuarioLogado(): Usuario | null {
    return this.loginService.usuarioLogado;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  temPermissao(...perfis: string[]): boolean {
    let usu = this.usuarioLogado;
    if (usu && usu.tipo && perfis.length > 0) {
      for (let p of perfis) {
        if (usu.tipo.toUpperCase().indexOf(p.toUpperCase()) !== -1) {
          return true;
        }
      }
    }
    return false;
  }
}
