import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UsuarioResponseDto } from '../../shared/models/remover-em-breve/dto/usuario-response-dto.model';
import { UsuarioRequestDto } from '../../shared/models/remover-em-breve/dto/usuario-request-dto.model';

const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  public get usuarioLogado(): UsuarioResponseDto {
    let usu = localStorage[LS_CHAVE];
    return usu ? JSON.parse(localStorage[LS_CHAVE]) : null;
  }

  public set usuarioLogado(usuario: UsuarioResponseDto) {
    localStorage[LS_CHAVE] = JSON.stringify(usuario);
  }

  logout() {
    delete localStorage[LS_CHAVE];
  }

  getUsuarioLogado(): UsuarioResponseDto {
    return this.usuarioLogado;
  }

  NEW_URL = 'http://localhost:8080/usuario';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  login(usuarioRequestDto: UsuarioRequestDto): Observable<UsuarioResponseDto | null> {
    return this._http
      .post<UsuarioResponseDto>(
        `${this.NEW_URL}/login`,
        JSON.stringify(usuarioRequestDto),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<UsuarioResponseDto>) => {
          if (resp.status == 200) {
            // console.log(resp.body);
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          return throwError(() => err);
        })
      );
  }
}
