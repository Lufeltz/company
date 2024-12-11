import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ReservaCriacaoGateway } from '../../shared/models/api-gateway/reserva-criacao-gateway.model';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';

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

  listarReservasUsuario(
    idUsuario: number
  ): Observable<ReservaGateway[] | null> {
    return this._http
      .get<ReservaGateway[]>(
        `${this.NEW_URL}/listar-reservas-cliente/${idUsuario}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<ReservaGateway[]>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao listar todas as reservas do usuário', err);
          return throwError(() => err);
        })
      );
  }

  realizarCheckin(codigoReserva: string): Observable<any> {
    return this._http
      .put<any>(`${this.NEW_URL}/reservas/fazer-checkin/${codigoReserva}`, null)
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao realizar check-in', err);
          return throwError(() => err);
        })
      );
  }

  criarReserva(reserva: ReservaCriacaoGateway): Observable<any> {
    return this._http
      .post<any>(
        `${this.NEW_URL}/reservas/cadastrar-reserva`,
        reserva,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 201) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao criar reserva', err);
          return throwError(() => err);
        })
      );
  }

  consultarReserva(codigoReserva: string): Observable<any> {
    return this._http
      .get<any>(
        `${this.NEW_URL}/reservas/consultar-reserva/${codigoReserva}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            return resp.body;
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
      .put<any>(`${this.NEW_URL}/reservas/confirmar-embarque`, null, {
        ...this.httpOptions,
        params: {
          codigoVoo: codigoVoo,
          codigoReserva: codigoReserva,
        },
      })
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 202) {
            return resp.body;
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

  cancelarReserva(codigoReserva: string): Observable<any> {
    return this._http
      .put<any>(
        `${this.NEW_URL}/reservas/cancelar-reserva/${codigoReserva}`,
        null,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          if (resp.status === 202) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao cancelar reserva', err);
          return throwError(() => err);
        })
      );
  }

  listarReservasVoos48h(
    idUsuario: number
  ): Observable<ReservaGateway[] | null> {
    return this._http
      .get<ReservaGateway[]>(
        `${this.NEW_URL}/reservas-voos-48h/${idUsuario}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<ReservaGateway[]>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error(
            'Erro ao listar reservas dos voos das próximas 48 horas',
            err
          );
          return throwError(() => err);
        })
      );
  }
}
