import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Login } from '../../shared/models/prototipo/login.model';

const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  
  NEW_URL = 'http://localhost:8080/usuario';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public get usuarioLogado(): Login {
    let usu = localStorage[LS_CHAVE];
    return usu ? JSON.parse(localStorage[LS_CHAVE]) : null;
  }

  public set usuarioLogado(usuario: Login) {
    localStorage[LS_CHAVE] = JSON.stringify(usuario);
  }

  logout() {
    delete localStorage[LS_CHAVE];
  }

  getUsuarioLogado(): Login {
    return this.usuarioLogado;
  }


  login(usuarioRequestDto: Login): Observable<Login | null> {
    return this._http
      .post<Login>(
        `${this.NEW_URL}/login`,
        JSON.stringify(usuarioRequestDto),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Login>) => {
          if (resp.status == 200) {
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
