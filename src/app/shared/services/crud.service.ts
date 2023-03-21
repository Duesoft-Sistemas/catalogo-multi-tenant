import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class CrudService<T> {
  baseUrl: string

  constructor(protected http: HttpClient, protected nomeController: string) {
    this.baseUrl = `${environment.UrlBase}/${this.nomeController}`;
  }

  create(record: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, record);
  }

  getByFilter(record: any): Observable<Response> {
    return this.http.post<Response>(`${this.baseUrl}/Filter`, record);
  }

  getAll(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  update(id: number, record: T): Observable<Response> {
    return this.http.put<Response>(`${this.baseUrl}/${id}`, record);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${id}`);
  }

  getAllList(): Observable<Response> {
    return this.http.get<Response>(`${this.baseUrl}/List`);
  }
}
