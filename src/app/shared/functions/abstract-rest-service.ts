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

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.urlBase).pipe(take(1));
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.urlBase}/${id}`).pipe(take(1));
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.urlBase, item).pipe(take(1));
  }

  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.urlBase}/${id}`, item).pipe(take(1));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(take(1));
  }
}
