import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/shared/functions/abstract-rest-service';
import { Pessoas } from './pessoas';

@Injectable({
  providedIn: 'root',
})
export class PessoasService extends AbstractRestService<Pessoas> {
  constructor(protected override http: HttpClient) {
    super(http, 'Pessoas');
  }
}
