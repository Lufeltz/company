import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Voo } from '../../shared/models/prototipo/voo.model';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';

@Injectable({
  providedIn: 'root',
})
export class VooGatewayService {
  constructor(private _http: HttpClient) {}

  private readonly NEW_URL = 'http://localhost:3015/api';

  private readonly httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllVoos(): Observable<VooGateway[] | null> {
    return this._http
      .get<VooGateway[]>(`${this.NEW_URL}/voos`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<VooGateway[]>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return [];
          }
        }),
        catchError((err) => {
          if (err.status === 404) {
            return of([]);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  getVooById(id: number): Observable<VooGateway | null> {
    return this._http
      .get<VooGateway>(`${this.NEW_URL}/voos/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<VooGateway>) => {
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

  postVoo(voo: VooGateway): Observable<VooGateway | null> {
    return this._http
      .post<VooGateway>(
        `${this.NEW_URL}/voos`,
        JSON.stringify(voo),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<VooGateway>) => {
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

  // putVoo(voo: VooGateway): Observable<VooGateway | null> {
  //   return this._http
  //     .put<VooGateway>(
  //       `${this.NEW_URL}/voos/${voo.id}`,
  //       JSON.stringify(voo),
  //       this.httpOptions
  //     )
  //     .pipe(
  //       map((resp: HttpResponse<VooGateway>) => {
  //         if (resp.status == 200) {
  //           return resp.body;
  //         } else {
  //           return null;
  //         }
  //       }),
  //       catchError((err, caught) => {
  //         return throwError(() => err);
  //       })
  //     );
  // }

  // deleteVoo(id: string): Observable<Voo | null> {
  //   return this._http
  //     .delete<Voo>(`${this.NEW_URL}/voos/${id}`, this.httpOptions)
  //     .pipe(
  //       map((resp: HttpResponse<Voo>) => {
  //         if (resp.status == 200) {
  //           return resp.body;
  //         } else {
  //           return null;
  //         }
  //       }),
  //       catchError((err, caught) => {
  //         return throwError(() => err);
  //       })
  //     );
  // }
}
