import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class TenantService {
  constructor() {}

  getTenantForHostname(hostname: string): Tenant {
    return this.getTenantForHost(hostname.split(".")[0]);
  }

  getTenantForString(s: string):any {
    for (const e in Tenant) {
      if (e.toLowerCase() === s.toLowerCase()) {
        return Tenant[e as keyof typeof Tenant] ;
      }
    }
    return null;
  }

  getTenantForHost(host: string): Tenant {
    return this.getTenantForString(host);
  }

  getTenant(): Tenant {
    return this.getTenantForHostname(location.hostname);
  }

  addTenantToHeaders(headers: HttpHeaders): HttpHeaders {
    return headers.append("X-Tenant-ID", this.getTenant());
  }

  getSchemaTenant(): string{
    var tenant = this.getTenant();
    var schema = '';
    if(tenant === 'catalogocanguru')
    schema = 'DSCOP';
    else
    if(tenant === 'catalogomendes')
    schema = 'Mendes';
    else
    if(tenant === 'catalogoautocar')
    schema = 'Autocar';
    else
    if(tenant === 'catalogomm')
    schema = 'MMDistribuidora';
    else
    if(tenant === 'catalogomicrotec')
    schema = 'Microtec';
    else
    if(tenant === 'catalogoprudenseg')
    schema = 'Prudenseg'
    else
    if(tenant === 'catalogolm')
    schema = 'Diskagua'

    return schema;
  }
}

export enum Tenant {
  catalogomaster = "catalogocanguru",
  catalogomendes = "catalogomendes",
  catalogoautocar = "catalogoautocar",
  catalogomm = "catalogomm",
  catalogomicrotec = "catalogomicrotec",
  catalogoprudenseg = "catalogoprudenseg",
  catalogolm = "catalogolm"
}
