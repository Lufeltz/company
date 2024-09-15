import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Milha } from '../../shared/models/prototipo/milha.model';

@Injectable({
  providedIn: 'root'
})
export class MilhasService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3000';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  
  getAllMilhas(): Observable<Milha[] | null> {
    return this._http
      .get<Milha[]>(`${this.NEW_URL}/milhas`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Milha[]>) => {
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

  getMilhaById(id: number): Observable<Milha | null> {
    return this._http
      .get<Milha>(`${this.NEW_URL}/milhas/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Milha>) => {
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

  postMilha(funcionario: Milha): Observable<Milha | null> {
    return this._http
      .post<Milha>(
        `${this.NEW_URL}/milhas`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Milha>) => {
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

  putMilha(funcionario: Milha): Observable<Milha | null> {
    return this._http
      .put<Milha>(
        `${this.NEW_URL}/milhas/${funcionario.id}`,
        JSON.stringify(funcionario),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Milha>) => {
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

  deleteMilha(id: string): Observable<Milha | null> {
    return this._http
      .delete<Milha>(
        `${this.NEW_URL}/milhas/${id}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Milha>) => {
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
