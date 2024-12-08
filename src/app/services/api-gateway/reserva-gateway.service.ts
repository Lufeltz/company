import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaGatewayService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3015/api';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  consultarReserva(codigoReserva: string): Observable<any> {
    return this._http
      .get<any>(
        `${this.NEW_URL}/reservas/consultar-reserva/${codigoReserva}`, // Endpoint no API Gateway
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            return resp.body; // Retorna o corpo da resposta
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao consultar reserva', err);
          return throwError(() => err);
        })
      );
  }

  confirmarEmbarque(codigoVoo: string, codigoReserva: string): Observable<any> {
    return this._http
      .put<any>(
        `${this.NEW_URL}/reservas/confirmar-embarque`, // Endpoint no API Gateway
        null, // O corpo da requisição é vazio (não é necessário passar dados)
        {
          ...this.httpOptions,
          params: {
            codigoVoo: codigoVoo,
            codigoReserva: codigoReserva,
          },
        }
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 202) {
            return resp.body; // Retorna o corpo da resposta
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao confirmar embarque', err);
          return throwError(() => err);
        })
      );
  }
}