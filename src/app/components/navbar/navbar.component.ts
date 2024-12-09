import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGatewayService } from '../../services/api-gateway/auth-gateway.service';
import { ClienteGateway } from '../../shared/models/api-gateway/cliente-gateway.model';
import { FuncionarioGateway } from '../../shared/models/api-gateway/funcionario-gateway.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private authGatewayService: AuthGatewayService
  ) {}

  sair() {
    this.router.navigate(['/login']);
  }

  get usuarioLogado(): ClienteGateway | FuncionarioGateway | null {
    return this.authGatewayService.getUser();
  }

  logout() {
    this.authGatewayService.logout();
    this.router.navigate(['/login']);
  }

  temPermissao(...perfis: string[]): boolean {
    const role = this.authGatewayService.getRoleFromToken();
    if (role && perfis.length > 0) {
      for (let perfil of perfis) {
        if (role.toUpperCase() === perfil.toUpperCase()) {
          return true;
        }
      }
    }
    return false;
  }

  getHomePageLink(): string {
    const role = this.authGatewayService.getRoleFromToken();
    return role === 'CLIENTE' ? '/homepage-cliente' : '/homepage';
  }
}
