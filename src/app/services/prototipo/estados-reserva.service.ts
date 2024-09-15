import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { EstadoReserva } from '../../shared/models/prototipo/estado-reserva.model';

@Injectable({
  providedIn: 'root'
})
export class EstadosReservaService  {

  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllEstadosReserva(): Observable<EstadoReserva[] | null> {
    return this._http
      .get<EstadoReserva[]>(`${this.NEW_URL}/estadosReserva`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<EstadoReserva[]>) => {
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

  getEstadosReservaById(id: number): Observable<EstadoReserva | null> {
    return this._http
      .get<EstadoReserva>(`${this.NEW_URL}/estadosReserva/${id}`,this.httpOptions)
      .pipe(
        map((resp: HttpResponse<EstadoReserva>) => {
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

  postEstadosReserva(funcionario: EstadoReserva): Observable<EstadoReserva | null> {
    return this._http
      .post<EstadoReserva>(
        `${this.NEW_URL}/estadosReserva`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<EstadoReserva>) => {
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

  putEstadosReserva(funcionario: EstadoReserva): Observable<EstadoReserva | null> {
    return this._http
      .put<EstadoReserva>(
        `${this.NEW_URL}/estadosReserva/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<EstadoReserva>) => {
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

  deleteEstadosReserva(id: string): Observable<EstadoReserva | null> {
    return this._http
      .delete<EstadoReserva>(
        `${this.NEW_URL}/estadosReserva/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<EstadoReserva>) => {
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