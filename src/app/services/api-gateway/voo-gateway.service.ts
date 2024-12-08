import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
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

  cancelarVoo(codigoVoo: string): Observable<any> {
    return this._http
      .put<any>(
        `${this.NEW_URL}/voos/cancelar-voo/${codigoVoo}`, // Adiciona '/voos' à URL
        null, // Corpo da requisição permanece vazio
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 202) {
            return resp.body; // Retorna o corpo da resposta, caso seja bem-sucedido
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao cancelar voo', err);
          return throwError(() => err);
        })
      );
  }

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
