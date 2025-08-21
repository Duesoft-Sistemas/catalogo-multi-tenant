import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MunicipiosService {
  private urlBase: string;

  constructor(private http: HttpClient) {
    this.urlBase = `${environment.UrlBase}/Municipios`;
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.urlBase);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlBase}/${id}`);
  }
}
