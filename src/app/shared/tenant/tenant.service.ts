import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  constructor() {}

  getTenantForHostname(hostname: string): Tenant {
    return this.getTenantForHost(hostname.split('.')[0]);
  }

  getTenantForString(s: string): any {
    for (const e in Tenant) {
      if (e.toLowerCase() === s.toLowerCase()) {
        return Tenant[e as keyof typeof Tenant];
      }
    }
    return null;
  }

  getTenantForHost(host: string): Tenant {
    return this.getTenantForString(host);
  }

  getTenant(): Tenant {
    // Para desenvolvimento local, usar um tenant padrão
    if (
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    ) {
      return 'catalogofrigorichter' as Tenant;
    }

    return this.getTenantForHostname(location.hostname);
  }

  addTenantToHeaders(headers: HttpHeaders): HttpHeaders {
    return headers.append('X-Tenant-ID', this.getTenant());
  }

  getSchemaTenant(): string {
    var tenant = this.getTenant();
    var schema = '';

    switch (tenant) {
      case 'catalogocanguru':
        schema = 'DSCOP';
        break;
      case 'catalogomendes':
        schema = 'Mendes';
        break;
      case 'catalogomm':
        schema = 'MMDistribuidora';
        break;
      case 'catalogomicrotec':
        schema = 'Microtec';
        break;
      case 'catalogoprudenseg':
        schema = 'Prudenseg';
        break;
      case 'catalogolm':
        schema = 'Diskagua';
        break;
      case 'catalogoprudentina':
        schema = 'Prudentina';
        break;
      case 'catalogobarone':
        schema = 'Barone';
        break;
      case 'catalogoatacado':
        schema = 'Atacado';
        break;
      case 'catalogofarmsrugs':
        schema = 'FarmsRugs';
        break;
      case 'catalogohvs':
        schema = 'Hvs';
        break;
      case 'catalogofarms':
        schema = 'FarmsHair';
        break;
      case 'catalogoclx':
        schema = 'Clx';
        break;
      case 'catalogoawsmetal':
        schema = 'AwsMetal';
        break;
      case 'catalogofrigorichter':
        schema = 'Frigorichter';
        break;
      case 'catalogofase':
        schema = 'Fase';
        break;
      case 'catalogoteste':
        schema = 'TesteDB';
        break;
    }

    return schema;
  }

  getCompanyNameBySchema(): string {
    var tenant = this.getTenant();
    var companyName = '';

    switch (tenant) {
      case 'catalogocanguru':
        companyName = 'DSCOP';
        break;
      case 'catalogomendes':
        companyName = 'Mendes';
        break;
      case 'catalogomm':
        companyName = 'MM Distribuidora';
        break;
      case 'catalogomicrotec':
        companyName = 'Microtec';
        break;
      case 'catalogoprudenseg':
        companyName = 'Prudenseg';
        break;
      case 'catalogolm':
        companyName = 'Diskagua';
        break;
      case 'catalogoprudentina':
        companyName = 'Prudentina';
        break;
      case 'catalogobarone':
        companyName = 'Barone';
        break;
      case 'catalogoatacado':
        companyName = 'Atacado';
        break;
      case 'catalogofarmsrugs':
        companyName = 'Farms Rugs';
        break;
      case 'catalogohvs':
        companyName = 'HVS';
        break;
      case 'catalogofarms':
        companyName = 'Farms Hair';
        break;
      case 'catalogoclx':
        companyName = 'CLX';
        break;
      case 'catalogoawsmetal':
        companyName = 'AWS Metal';
        break;
      case 'catalogofrigorichter':
        companyName = 'Frigorichter';
        break;
      case 'catalogofase':
        companyName = 'Fase';
        break;
      case 'catalogoteste':
        companyName = 'Teste DB';
        break;
      default:
        companyName = 'Empresa';
        break;
    }

    return companyName;
  }
}

export enum Tenant {
  catalogomaster = 'catalogocanguru',
  catalogomendes = 'catalogomendes',
  catalogomm = 'catalogomm',
  catalogomicrotec = 'catalogomicrotec',
  catalogoprudenseg = 'catalogoprudenseg',
  catalogolm = 'catalogolm',
  catalogoprudentina = 'catalogoprudentina',
  catalogobarone = 'catalogobarone',
  catalogoatacado = 'catalogoatacado',
  catalogofarmsrugs = 'catalogofarmsrugs',
  catalogohvs = 'catalogohvs',
  catalogofarms = 'catalogofarms',
  catalogoclx = 'catalogoclx',
  catalogoawsmetal = 'catalogoawsmetal',
  catalogofrigorichter = 'catalogofrigorichter',
  catalogofase = 'catalogofase',
  catalogoteste = 'catalogoteste',
}
