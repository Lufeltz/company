import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Cliente } from '../../shared/models/remover-em-breve/cliente.model';
import { ClienteDto } from '../../shared/models/remover-em-breve/dto/cliente-dto.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private _http: HttpClient) {}

  NEW_URL = 'http://localhost:8080/cliente';

  httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  cadastrar(cliente: Cliente): Observable<ClienteDto | null> {
    return this._http
      .post<ClienteDto>(`${this.NEW_URL}/cadastrar`, JSON.stringify(cliente), this.httpOptions)
      .pipe(
        map((resp: HttpResponse<ClienteDto>) => {
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

  consultarPorIdUsuario(idUsuario: number): Observable<ClienteDto | null> {
    return this._http
      .get<ClienteDto>(`${this.NEW_URL}/consultar/${idUsuario}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<ClienteDto>) => {
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

  getAllClientes(): Observable<Cliente[] | null> {
    return this._http.get<Cliente[]>(this.NEW_URL, this.httpOptions).pipe(
      map((resp: HttpResponse<Cliente[]>) => {
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

  getClienteById(id: number): Observable<Cliente | null> {
    return this._http
      .get<Cliente>(`${this.NEW_URL}/consultar/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  postCliente(cliente: Cliente): Observable<Cliente | null> {
    return this._http
      .post<Cliente>(this.NEW_URL, JSON.stringify(cliente), this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  putCliente(cliente: Cliente): Observable<Cliente | null> {
    return this._http
      .put<Cliente>(
        `${this.NEW_URL}/???/${cliente.idUsuario}`,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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

  deleteCliente(id: number): Observable<Cliente | null> {
    return this._http
      .delete<Cliente>(`${this.NEW_URL}/???/${id}`, this.httpOptions)
      .pipe(
        map((resp: HttpResponse<Cliente>) => {
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
