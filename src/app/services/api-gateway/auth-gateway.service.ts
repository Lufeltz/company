import { Injectable } from '@angular/core';

import { ClienteGateway } from '../../shared/models/api-gateway/cliente-gateway.model';
import { FuncionarioGateway } from '../../shared/models/api-gateway/funcionario-gateway.model';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { LoginResponseGateway } from '../../shared/models/api-gateway/login-response-gateway.model';
import { LoginRequestGateway } from '../../shared/models/api-gateway/login-request-gateway.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGatewayService {
  private readonly NEW_URL = 'http://localhost:3015/api';
  private readonly httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private user: ClienteGateway | FuncionarioGateway | null = null;

  constructor(
    private _http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    if (this.isAuthenticated()) {
      this.loadUserData().subscribe();
    }
  }

  login(loginRequest: LoginRequestGateway): Observable<string | null> {
    return this._http
      .post<LoginResponseGateway>(
        `${this.NEW_URL}/auth/login`,
        JSON.stringify(loginRequest),
        {
          headers: this.httpOptions.headers,
          observe: 'body',
        }
      )
      .pipe(
        tap((resp) => {
          if (resp.token) {
            this.tokenService.setToken(resp.token);
            this.loadUserData().subscribe();
          }
        }),
        map((resp) => resp.token || null),
        catchError((err) => throwError(() => err))
      );
  }

  loadUserData(): Observable<ClienteGateway | FuncionarioGateway | undefined> {
    const email = this.getEmailFromToken();
    const role = this.getRoleFromToken();
    if (email !== null && role !== null) {
      const token = this.tokenService.getToken();
      const headers = this.httpOptions.headers.set(
        'Authorization',
        `Bearer ${token}`
      );

      const endpoint =
        role === 'FUNCIONARIO'
          ? `${this.NEW_URL}/funcionarios/email/${email}`
          : `${this.NEW_URL}/clientes/email/${email}`;

      return this._http
        .get<ClienteGateway | FuncionarioGateway>(endpoint, { headers })
        .pipe(
          tap((user) => {
            this.user = user;
          }),
          catchError((err) => {
            console.error(
              `Erro ao obter os dados do ${role.toLowerCase()}:`,
              err
            );
            return of(undefined);
          })
        );
    }
    return of(undefined);
  }

  logout(): void {
    this.tokenService.clearToken();
    this.user = null;
    this.router.navigate(['/login']);
  }

  getUser(): ClienteGateway | FuncionarioGateway | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        this.logout();
        return false;
      }
      return true;
    }
    return false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private getEmailFromToken(): string | null {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.sub || null;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
    return null;
  }

  getRoleFromToken(): string | null {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role || null;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
    return null;
  }
}
