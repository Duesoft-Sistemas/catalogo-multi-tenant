import { IFormularios } from "../interface/IFormularios";
import { Tenant, TenantService } from "../tenant/tenant.service";
import { Clientes } from "./clientes";

export class SeletorImagemCatalogo implements IFormularios {
  clientes : Clientes

  constructor(private serviceTenant : TenantService) {
    this.clientes = new Clientes();
  }

  getValidators(): any {
    const validators = [];
    return validators;
  }

  getImagem(){
    this.clientes.cliente1 = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.clientes.cliente2 = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.clientes.cliente3 = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.clientes.cliente4 = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.clientes.cliente5 = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.clientes.cliente6 = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.clientes.cliente7 = this.serviceTenant.getTenant() === Tenant.catalogolm;
    return this.clientes;
  }

}
