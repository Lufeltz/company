import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MilhasGatewayService {
  constructor(private _http: HttpClient) {}

  private readonly NEW_URL = 'http://localhost:3015/api';

  private readonly httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // Função para comprar milhas
  comprarMilhas(idCliente: number, quantidadeMilhas: number): Observable<any> {
    const url = `${this.NEW_URL}/comprar-milhas?idCliente=${idCliente}&quantidadeMilhas=${quantidadeMilhas}`;

    return this._http
      .post<any>(url, null, this.httpOptions) // Usando POST conforme a API da Gateway
      .pipe(
        map((resp) => {
          if (resp.status === 200) {
            return resp.body; // Sucesso na resposta
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao comprar milhas', err);
          throw err;
        })
      );
  }
}
