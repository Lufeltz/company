import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../../shared/models/prototipo/reserva.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllReservas(): Observable<Reserva[] | null> {
    return this._http
      .get<Reserva[]>(`${this.NEW_URL}/reservas`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Reserva[]>) => {
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

  getReservaById(id: number): Observable<Reserva | null> {
    return this._http
      .get<Reserva>(`${this.NEW_URL}/reservas/${id}`,this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Reserva>) => {
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

  postReserva(funcionario: Reserva): Observable<Reserva | null> {
    return this._http
      .post<Reserva>(
        `${this.NEW_URL}/reservas`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Reserva>) => {
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

  putReserva(funcionario: Reserva): Observable<Reserva | null> {
    return this._http
      .put<Reserva>(
        `${this.NEW_URL}/reservas/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Reserva>) => {
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

  deleteReserva(id: string): Observable<Reserva | null> {
    return this._http
      .delete<Reserva>(
        `${this.NEW_URL}/reservas/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Reserva>) => {
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
