import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Cadastro } from '../../shared/models/prototipo/cadastro.model';

@Injectable({
  providedIn: 'root',
})
export class AutocadastroService {
  constructor(private _http: HttpClient) {}

  // NEW_URL = 'http://localhost:8080/usuario';
  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  postCadastro(cadastro: Cadastro): Observable<Cadastro | null> {
    return this._http
      .post<Cadastro>(
        `${this.NEW_URL}/usuarios`,
        JSON.stringify(cadastro),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Cadastro>) => {
          if (resp.status == 201) {
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
