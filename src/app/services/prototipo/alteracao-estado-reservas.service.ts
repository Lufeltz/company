

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AlteracaoEstadoReserva } from '../../shared/models/prototipo/alteracao-estado-reserva.model';

@Injectable({
  providedIn: 'root'
})
export class AlteracaoEstadoReservasService {

  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllAlteracaoEstadoReserva(): Observable<AlteracaoEstadoReserva[] | null> {
    return this._http
      .get<AlteracaoEstadoReserva[]>(`${this.NEW_URL}/alteracaoEstadoReservas`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<AlteracaoEstadoReserva[]>) => {
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

  getAlteracaoEstadoReservasById(id: number): Observable<AlteracaoEstadoReserva | null> {
    return this._http
      .get<AlteracaoEstadoReserva>(`${this.NEW_URL}/alteracaoEstadoReservas/${id}`,this.httpOptions)
      .pipe(
        map((resp: HttpResponse<AlteracaoEstadoReserva>) => {
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

  postAlteracaoEstadoReservas(funcionario: AlteracaoEstadoReserva): Observable<AlteracaoEstadoReserva | null> {
    return this._http
      .post<AlteracaoEstadoReserva>(
        `${this.NEW_URL}/alteracaoEstadoReservas`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<AlteracaoEstadoReserva>) => {
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

  putAlteracaoEstadoReservas(funcionario: AlteracaoEstadoReserva): Observable<AlteracaoEstadoReserva | null> {
    return this._http
      .put<AlteracaoEstadoReserva>(
        `${this.NEW_URL}/alteracaoEstadoReservas/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<AlteracaoEstadoReserva>) => {
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

  deleteAlteracaoEstadoReservas(id: string): Observable<AlteracaoEstadoReserva | null> {
    return this._http
      .delete<AlteracaoEstadoReserva>(
        `${this.NEW_URL}/alteracaoEstadoReservas/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<AlteracaoEstadoReserva>) => {
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
