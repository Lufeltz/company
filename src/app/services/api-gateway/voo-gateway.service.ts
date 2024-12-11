import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';
import { CadastroVooGateway } from '../../shared/models/api-gateway/cadastro-voo-gateway.model';
import { ReservaGateway } from '../../shared/models/api-gateway/reserva-gateway.model';

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

  getVoosCanceladosRealizados(
    idUsuario: number
  ): Observable<ReservaGateway[] | null> {
    return this._http
      .get<ReservaGateway[]>(
        `${this.NEW_URL}/voos-realizados-cancelados/${idUsuario}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<ReservaGateway[]>) => {
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

  realizarVoo(codigoVoo: string): Observable<any> {
    return this._http
      .put<any>(
        `${this.NEW_URL}/voos/realizar-voo/${codigoVoo}`,
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
          console.error('Erro ao realizar voo', err);
          return throwError(() => err);
        })
      );
  }

  cancelarVoo(codigoVoo: string): Observable<any> {
    return this._http
      .put<any>(
        `${this.NEW_URL}/voos/cancelar-voo/${codigoVoo}`,
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

  getVooById(codigoVoo: string): Observable<VooGateway | null> {
    return this._http
      .get<VooGateway>(`${this.NEW_URL}/voos/${codigoVoo}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<VooGateway>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          if (err.status === 404) {
            return of(null);
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  cadastrarVoo(voo: CadastroVooGateway): Observable<CadastroVooGateway | null> {
    return this._http
      .post<CadastroVooGateway>(
        `${this.NEW_URL}/voos/cadastrar-voo`,
        JSON.stringify(voo),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<CadastroVooGateway>) => {
          if (resp.status === 201) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao cadastrar voo', err);
          return throwError(() => err);
        })
      );
  }

  listarVoosAtuais(
    codigoAeroportoOrigem: string,
    codigoAeroportoDestino: string
  ): Observable<VooGateway[] | null> {
    return this._http
      .get<VooGateway[]>(
        `${this.NEW_URL}/voos-atuais?codigoAeroportoOrigem=${codigoAeroportoOrigem}&codigoAeroportoDestino=${codigoAeroportoDestino}`,
        this.httpOptions
      )
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

  listarAeroportos(): Observable<any[] | null> {
    return this._http
      .get<any[]>(`${this.NEW_URL}/listar-aeroporto`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<any[]>) => {
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
}
