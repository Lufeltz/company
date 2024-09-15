import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Funcionario } from '../../shared/models/prototipo/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllFuncionarios(): Observable<Funcionario[] | null> {
    return this._http
      .get<Funcionario[]>(`${this.NEW_URL}/funcionarios`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Funcionario[]>) => {
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

  getFuncionarioById(id: number): Observable<Funcionario | null> {
    return this._http
      .get<Funcionario>(`${this.NEW_URL}/funcionarios/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  postFuncionario(funcionario: Funcionario): Observable<Funcionario | null> {
    return this._http
      .post<Funcionario>(
        `${this.NEW_URL}/funcionarios`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  putFuncionario(funcionario: Funcionario): Observable<Funcionario | null> {
    return this._http
      .put<Funcionario>(
        `${this.NEW_URL}/funcionarios/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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

  deleteFuncionario(id: string): Observable<Funcionario | null> {
    return this._http
      .delete<Funcionario>(
        `${this.NEW_URL}/funcionarios/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Funcionario>) => {
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
