import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Toaster } from '../functions/toaster';
import { IMunicipios } from '../interface/IMunicipios';

@Injectable({
  providedIn: 'root',
})
export class MunicipiosService {
  private urlBase: string;

  constructor(private http: HttpClient) {
    this.urlBase = `${environment.UrlBase}/Municipios`;
  }

  getAll(hiddenError?: boolean): Promise<IMunicipios> {
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

  getById(codigo: number): Promise<IMunicipios> {
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

  getByUf(uf: string): Promise<IMunicipios> {
    return new Promise((resolve, reject) => {
      this.httpGetByUf(uf)
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

  update(codigo: number, data: IMunicipios): Promise<boolean> {
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

  private httpGetById(id: number): Observable<IMunicipios> {
    return this.http.get<IMunicipios>(`${this.urlBase}/${id}`);
  }

  private httpGetByUf(uf: string): Observable<IMunicipios> {
    return this.http.get<IMunicipios>(`${this.urlBase}/GetByUf/${uf}`);
  }

  private httpUpdate(id: number, record: IMunicipios): Observable<Response> {
    return this.http.put<Response>(`${this.urlBase}/${id}`, record);
  }
}
