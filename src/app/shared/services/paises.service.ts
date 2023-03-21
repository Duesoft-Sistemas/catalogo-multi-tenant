import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Toaster } from '../functions/toaster';
import { IPaises } from '../interface/IPaises';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private urlBase: string;

  constructor(private http: HttpClient) {
    this.urlBase = `${environment?.UrlBase}/Paises`;
  }

  getAll(hiddenError?: boolean): Promise<IPaises> {
    return new Promise((resolve, reject) => {
      this.httpGetAll()
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.processed) {
              resolve(data.result);
            } else {
              hiddenError ?? Toaster.Warning(data.errorMessage);
              reject(data.errorMessage);
            }
          },
          error: (error) => {
            hiddenError ?? Toaster.Error(Toaster.msg.ErroCarregarDados);
            reject(error);
          },
        });
    });
  }

  getById(codigo: number): Promise<IPaises> {
    return new Promise((resolve, reject) => {
      this.httpGetById(codigo)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.processed) {
              resolve(data.result);
            } else {
              Toaster.Warning(data.errorMessage);
              reject(data.errorMessage);
            }
          },
          error: (error) => {
            Toaster.Error(Toaster.msg.ErroCarregarDados);
            reject(error);
          },
        });
    });
  }

  update(codigo: number, data: IPaises): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpUpdate(codigo, data)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.processed) {
              Toaster.Success(Toaster.msg.RegistroSalvo);
              resolve(true);
            } else {
              Toaster.Warning(data.errorMessage);
              reject(data.errorMessage);
            }
          },
          error: (error: any) => {
            Toaster.Error(Toaster.msg.ErroSalvar);
            reject(error);
          },
        });
    });
  }

  private httpGetAll(): Observable<Response> {
    return this.http.get<Response>(`${this.urlBase}`);
  }

  private httpGetById(id: number): Observable<IPaises> {
    return this.http.get<IPaises>(`${this.urlBase}/${id}`);
  }

  private httpUpdate(id: number, record: IPaises): Observable<Response> {
    return this.http.put<Response>(`${this.urlBase}/${id}`, record);
  }
}
