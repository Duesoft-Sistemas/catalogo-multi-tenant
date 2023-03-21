import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Toaster } from './toaster';

export abstract class AbstractRestService<T> {
  urlBase;

  constructor(protected http: HttpClient, protected controller: string) {
    this.urlBase = `${environment.UrlBase}/${controller}`;
  }

  getAll(hiddenError?: boolean): Promise<T> {
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

  getById(codigo: number): Promise<T> {
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

  create(data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpCreate(data)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.processed) {
              Toaster.Success(Toaster.msg.RegistroSalvo);
              resolve(true);
            } else {
              // Toaster.Warning(data.errorMessage);
              Toaster.Warning(Toaster.msg.ErroSalvar);
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

  update(codigo: number, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpUpdate(codigo, data)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.processed) {
              Toaster.Success(Toaster.msg.RegistroSalvo);
              resolve(true);
            } else {
              // Toaster.Warning(data.errorMessage);
              Toaster.Warning(Toaster.msg.ErroAlterar);
              reject(data.errorMessage);
            }
          },
          error: (error: any) => {
            Toaster.Error(Toaster.msg.ErroAlterar);
            reject(error);
          },
        });
    });
  }

  delete(codigo: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.httpDelete(codigo)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.processed) {
              Toaster.Success(Toaster.msg.RegistroExcluido);
              resolve(this.getAll());
            } else {
              // Toaster.Warning(data.errorMessage);
              Toaster.Warning(Toaster.msg.ErroExcluir);
              reject(data.errorMessage);
            }
          },
          error: (error: any) => {
            Toaster.Error(Toaster.msg.ErroExcluir);
            reject(error);
          },
        });
    });
  }

  private httpGetAll(): Observable<Response> {
    return this.http.get<Response>(`${this.urlBase}`);
  }

  private httpGetById(id: number): Observable<T> {
    return this.http.get<T>(`${this.urlBase}/${id}`);
  }

  private httpCreate(record: T): Observable<T> {
    return this.http.post<T>(`${this.urlBase}`, record);
  }

  private httpUpdate(id: number, record: T): Observable<Response> {
    return this.http.put<Response>(`${this.urlBase}/${id}`, record);
  }

  private httpDelete(id: number): Observable<T> {
    return this.http.delete<T>(`${this.urlBase}/${id}`);
  }
}
