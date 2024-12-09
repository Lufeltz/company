import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { VooGateway } from '../../shared/models/api-gateway/voo-gateway';
import { CadastroVooGateway } from '../../shared/models/api-gateway/cadastro-voo-gateway.model';

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

  realizarVoo(codigoVoo: string): Observable<any> {
    return this._http
      .put<any>(
        `${this.NEW_URL}/voos/realizar-voo/${codigoVoo}`, // Atualizado para o endpoint de realizar voo
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
          console.error('Erro ao realizar voo', err);
          return throwError(() => err);
        })
      );
  }

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

  // Método para obter voo por código do voo
  getVooById(codigoVoo: string): Observable<VooGateway | null> {
    return this._http
      .get<VooGateway>(`${this.NEW_URL}/voos/${codigoVoo}`, this.httpOptions) // Passando o codigoVoo na URL
      .pipe(
        map((resp: HttpResponse<VooGateway>) => {
          if (resp.status === 200) {
            return resp.body; // Retorna o corpo da resposta (Voo)
          } else {
            return null;
          }
        }),
        catchError((err, caught) => {
          if (err.status === 404) {
            return of(null); // Retorna null caso o voo não seja encontrado
          } else {
            return throwError(() => err); // Lança o erro caso outro tipo de erro aconteça
          }
        })
      );
  }

  // Método para cadastrar um voo
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

  // Novo método para listar voos atuais
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

  // Novo método para listar todos os aeroportos
  listarAeroportos(): Observable<any[] | null> {
    return this._http
      .get<any[]>(
        `${this.NEW_URL}/listar-aeroporto`, // Novo endpoint para listar aeroportos
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<any[]>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return []; // Retorna uma lista vazia em caso de falha
          }
        }),
        catchError((err) => {
          if (err.status === 404) {
            return of([]); // Retorna uma lista vazia caso não haja dados
          } else {
            return throwError(() => err); // Lança o erro em outros casos
          }
        })
      );
  }
}
