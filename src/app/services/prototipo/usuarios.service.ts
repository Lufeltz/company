import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Usuario } from '../../shared/models/prototipo/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllUsuarios(): Observable<Usuario[] | null> {
    return this._http
      .get<Usuario[]>(`${this.NEW_URL}/usuarios`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Usuario[]>) => {
          if (resp.status == 200) {
            return resp.body;
          } else {
            return [];
          }
        }),
        catchError((err, caught) => {
          if (err.status == 404) {
            return of([]);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  getUsuarioById(id: number): Observable<Usuario | null> {
    return this._http
      .get<Usuario>(`${this.NEW_URL}/usuarios/${id}`,this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Usuario>) => {
          if (resp.status == 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          if (err.status == 404) {
            return of(null);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  postUsuario(funcionario: Usuario): Observable<Usuario | null> {
    return this._http
      .post<Usuario>(
        `${this.NEW_URL}/usuarios`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Usuario>) => {
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

  putUsuario(funcionario: Usuario): Observable<Usuario | null> {
    return this._http
      .put<Usuario>(
        `${this.NEW_URL}/usuarios/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Usuario>) => {
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

  deleteUsuario(id: string): Observable<Usuario | null> {
    return this._http
      .delete<Usuario>(
        `${this.NEW_URL}/usuarios/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Usuario>) => {
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
