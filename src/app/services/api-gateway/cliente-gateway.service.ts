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

  NEW_URL = 'http://localhost:3015/api'; // URL do API Gateway

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // Método para cadastrar um cliente, usando o endpoint correto na API Gateway
  cadastrarCliente(
    cliente: CadastroGateway
  ): Observable<CadastroGateway | null> {
    return this._http
      .post<CadastroGateway>(
        `${this.NEW_URL}/clientes/cadastrar-cliente`, // Endpoint na API Gateway
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<CadastroGateway>) => {
          if (resp.status === 201) {
            return resp.body; // Retorna o cliente cadastrado com sucesso
          } else {
            return null; // Se o status não for 201, retorna null
          }
        }),
        catchError((err) => {
          console.error('Erro ao cadastrar cliente', err);
          return throwError(() => err); // Lança o erro para ser tratado onde a função é chamada
        })
      );
  }

  // Método para consultar o endereço via CEP
  consultarEndereco(cep: string): Observable<EnderecoGateway | null> {
    return this._http
      .get<EnderecoGateway>(
        `${this.NEW_URL}/clientes/consultar-endereco/${cep}`,
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<EnderecoGateway>) => {
          // Verifica se a resposta foi bem-sucedida (status 200)
          if (resp.status === 200) {
            return resp.body; // Retorna o corpo da resposta, que é o EnderecoGateway
          } else {
            return null; // Se o status não for 200, retorna null
          }
        }),
        catchError((err) => {
          // Caso haja erro, trata o erro com um Observable null
          console.error('Erro ao consultar endereço:', err);
          return of(null); // Retorna null em caso de erro
        })
      );
  }
}
