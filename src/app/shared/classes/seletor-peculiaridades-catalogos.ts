import { IFormularios } from "../interface/IFormularios";
import { Tenant, TenantService } from "../tenant/tenant.service";
import { Clientes } from "./clientes";

export class SeletorPeculiaridadesCatalogos implements IFormularios {
  clientes: Clientes;
  nomeCatalogo: string;
  logoLogin: string;
  logoInicio: string;
  logoSidebar: string;
  cadastrarCliente: boolean;
  pesquisaAvancada: boolean;

  constructor(private serviceTenant : TenantService) {
    this.clientes = new Clientes();
  }

  getValidators(): any {
    const validators = [];
    return validators;
  }

  getTenant(){
    this.clientes.cliente1 = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.clientes.cliente2 = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.clientes.cliente3 = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.clientes.cliente4 = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.clientes.cliente5 = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.clientes.cliente6 = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.clientes.cliente7 = this.serviceTenant.getTenant() === Tenant.catalogolm;

    if(this.clientes.cliente1){
      this.nomeCatalogo = "Mendes";
      this.logoSidebar = "Fundo_Mendes.jpeg";
      this.logoLogin = "Fundo_Mendes.jpeg";
      this.logoInicio = "Plano_Fundo_Mendes2.png";
      this.cadastrarCliente = true;
      this.pesquisaAvancada = true;
    }
    if(this.clientes.cliente2){
      this.nomeCatalogo = "Canguru";
      this.logoSidebar = "logo_canguru.png";
      this.logoLogin = "CatalogoMasterFundo.png";
      this.logoInicio = "CatalogoMasterFundo.png";
      this.cadastrarCliente = false;
      this.pesquisaAvancada = false;
    }
    if(this.clientes.cliente3){
      this.nomeCatalogo = "Autocar";
      this.logoSidebar = "autocar.jpg";
      this.logoLogin = "autocar.jpg";
      this.logoInicio = "autocar.jpg";
      this.cadastrarCliente = false;
      this.pesquisaAvancada = true;
    }
    if(this.clientes.cliente4){
      this.nomeCatalogo = "Microtec";
      this.logoSidebar = "microtec_logo.png";
      this.logoLogin = "microtec_logo.png";
      this.logoInicio = "microtec_logo.png";
      this.cadastrarCliente = false;
      this.pesquisaAvancada = true;
    }
    if(this.clientes.cliente5){
      this.nomeCatalogo = "MM Distribuidora";
      this.logoSidebar = "mmdistribuidora.png";
      this.logoLogin = "mmdistribuidora.png";
      this.logoInicio = "mmdistribuidora.png";
      this.cadastrarCliente = false;
      this.pesquisaAvancada = true;
    }
    if(this.clientes.cliente6){
      this.nomeCatalogo = "Prudenseg";
      this.logoSidebar = "logo_prudenseg.png";
      this.logoLogin = "logo_prudenseg.png";
      this.logoInicio = "logo_prudenseg.png";
      this.cadastrarCliente = true;
      this.pesquisaAvancada = true;
    }
    if(this.clientes.cliente7){
      this.nomeCatalogo = "Disk água";
      this.logoSidebar = "iconeDiskAgua.jpg";
      this.logoLogin = "esguicho-dagua.png";
      this.logoInicio = "esguicho-dagua.png";
      this.cadastrarCliente = false;
      this.pesquisaAvancada = true;
    }
    return this.clientes;
  }

}
