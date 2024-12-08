import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnderecoGateway } from '../../shared/models/api-gateway/endereco-gateway.model';
import { ClienteGateway } from '../../shared/models/api-gateway/cliente-gateway.model';
import { CadastroGateway } from '../../shared/models/api-gateway/cadastro-gateway.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteGatewayService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:3015/api';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  cadastrarCliente(
    cliente: CadastroGateway
  ): Observable<CadastroGateway | null> {
    return this._http
      .post<CadastroGateway>(
        `${this.NEW_URL}/clientes/cadastrar-cliente`,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<CadastroGateway>) => {
          if (resp.status === 201) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao cadastrar cliente', err);
          return throwError(() => err);
        })
      );
  }

  consultarEndereco(cep: string): Observable<EnderecoGateway | null> {
    return this._http
      .get<EnderecoGateway>(
        `${this.NEW_URL}/clientes/consultar-endereco/${cep}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<EnderecoGateway>) => {
          if (resp.status === 200) {
            return resp.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.error('Erro ao consultar endereço:', err);
          return of(null);
        })
      );
  }
}
