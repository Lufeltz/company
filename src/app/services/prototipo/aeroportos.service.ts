import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Aeroporto } from '../../shared/models/prototipo/aeroporto.model';

@Injectable({
  providedIn: 'root'
})
export class AeroportosService {

  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllAeroportos(): Observable<Aeroporto[] | null> {
    return this._http
      .get<Aeroporto[]>(`${this.NEW_URL}/aeroportos`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Aeroporto[]>) => {
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

  getAeroportoById(id: number): Observable<Aeroporto | null> {
    return this._http
      .get<Aeroporto>(`${this.NEW_URL}/aeroportos/${id}`,this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Aeroporto>) => {
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

  postAeroporto(funcionario: Aeroporto): Observable<Aeroporto | null> {
    return this._http
      .post<Aeroporto>(
        `${this.NEW_URL}/aeroportos`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Aeroporto>) => {
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

  putAeroporto(funcionario: Aeroporto): Observable<Aeroporto | null> {
    return this._http
      .put<Aeroporto>(
        `${this.NEW_URL}/aeroportos/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Aeroporto>) => {
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

  deleteAeroporto(id: string): Observable<Aeroporto | null> {
    return this._http
      .delete<Aeroporto>(
        `${this.NEW_URL}/aeroportos/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Aeroporto>) => {
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
