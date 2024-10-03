import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Voo } from '../../shared/models/prototipo/voo.model';

@Injectable({
  providedIn: 'root'
})
export class VoosService {

  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllVoos(): Observable<Voo[] | null> {
    return this._http
      .get<Voo[]>(`${this.NEW_URL}/voos`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Voo[]>) => {
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

  getVooById(id: number): Observable<Voo | null> {
    return this._http
      .get<Voo>(`${this.NEW_URL}/voos/${id}`,this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Voo>) => {
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

  postVoo(voo: Voo): Observable<Voo | null> {
    return this._http
      .post<Voo>(
        `${this.NEW_URL}/voos`,
        JSON.stringify(voo),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Voo>) => {
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

  putVoo(funcionario: Voo): Observable<Voo | null> {
    return this._http
      .put<Voo>(
        `${this.NEW_URL}/voos/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Voo>) => {
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

  deleteVoo(id: string): Observable<Voo | null> {
    return this._http
      .delete<Voo>(
        `${this.NEW_URL}/voos/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Voo>) => {
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
