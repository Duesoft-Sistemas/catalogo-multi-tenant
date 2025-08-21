import { Injectable } from "@angular/core";
import { Tenant, TenantService } from "../tenant/tenant.service";

@Injectable({
  providedIn: 'root'
})
export class SeletorPeculiaridadesCatalogos {
  nomeCatalogo: string = '';
  logoSidebar: string = '';
  logoLogin: string = '';
  logoInicio: string = '';
  cadastrarCliente: boolean = false;
  pesquisaAvancada: boolean = false;

  clientes = {
    cliente1: false,
    cliente2: false,
    cliente3: false,
    cliente4: false,
    cliente5: false,
    cliente6: false,
    cliente7: false,
    cliente8: false,
    cliente9: false,
    cliente10: false,
    cliente11: false,
    cliente12: false,
    cliente13: false,
    cliente14: false,
    cliente15: false,
    cliente16: false,
    cliente17: false,
    cliente18: false,
  };

  constructor(private serviceTenant: TenantService) { }

  getTenant(){
    switch (this.serviceTenant.getTenant()) {
      case Tenant.catalogomendes:
        this.clientes.cliente1 = true;
        this.nomeCatalogo = "Mendes";
        this.logoSidebar = "Fundo_Mendes.jpeg";
        this.logoLogin = "Fundo_Mendes.jpeg";
        this.logoInicio = "Plano_Fundo_Mendes2.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogomaster:
        this.clientes.cliente2 = true;
        this.nomeCatalogo = "Canguru";
        this.logoSidebar = "logo_canguru.png";
        this.logoLogin = "CatalogoMasterFundo.png";
        this.logoInicio = "CatalogoMasterFundo.png";
        this.cadastrarCliente = false;
        this.pesquisaAvancada = false;
        break;
      // case Tenant.catalogoautocar:
      //   this.clientes.cliente3 = true;
      //   this.nomeCatalogo = "Autocar";
      //   this.logoSidebar = "autocar.jpg";
      //   this.logoLogin = "autocar.jpg";
      //   this.logoInicio = "autocar.jpg";
      //   this.cadastrarCliente = false;
      //   this.pesquisaAvancada = true;
      //   break;
      case Tenant.catalogomicrotec:
        this.clientes.cliente4 = true;
        this.nomeCatalogo = "Microtec";
        this.logoSidebar = "microtec_logo.png";
        this.logoLogin = "microtec_logo.png";
        this.logoInicio = "microtec_logo.png";
        this.cadastrarCliente = false;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogomm:
        this.clientes.cliente5 = true;
        this.nomeCatalogo = "MM Distribuidora";
        this.logoSidebar = "mmdistribuidora.png";
        this.logoLogin = "mmdistribuidora.png";
        this.logoInicio = "mmdistribuidora.png";
        this.cadastrarCliente = false;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogoprudenseg:
        this.clientes.cliente6 = true;
        this.nomeCatalogo = "Prudenseg";
        this.logoSidebar = "logo_prudenseg.png";
        this.logoLogin = "logo_prudenseg.png";
        this.logoInicio = "logo_prudenseg.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogolm:
        this.clientes.cliente7 = true;
        this.nomeCatalogo = "Disk água";
        this.logoSidebar = "iconeDiskAgua.jpg";
        this.logoLogin = "esguicho-dagua.png";
        this.logoInicio = "esguicho-dagua.png";
        this.cadastrarCliente = false;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogoprudentina:
        this.clientes.cliente8 = true;
        this.nomeCatalogo = "Prudentina";
        this.logoSidebar = "navbarPrudentina.jpeg";
        this.logoLogin = "FundoPrudentina.png";
        this.logoInicio = "FundoPrudentina.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogobarone:
        this.clientes.cliente9 = true;
        this.nomeCatalogo = "Barone";
        this.logoSidebar = "faviconBarone_resized.png";
        this.logoLogin = "sorvetes-barone-logo.png";
        this.logoInicio = "sorvetes-barone-logo.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogoatacado:
        this.clientes.cliente10 = true;
        this.nomeCatalogo = "Atacado";
        this.logoSidebar = "Fundo_Mendes.jpeg";
        this.logoLogin = "Fundo_Mendes.jpeg";
        this.logoInicio = "Plano_Fundo_Mendes2.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogofarmsrugs:
        this.clientes.cliente11 = true;
        this.nomeCatalogo = "Farms Rugs";
        this.logoSidebar = "farms_rugs_logo.png";
        this.logoLogin = "farms_rugs_logo.png";
        this.logoInicio = "farms_rugs_logo.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogohvs:
        this.clientes.cliente12 = true;
        this.nomeCatalogo = "Hvs";
        this.logoSidebar = "navbarHvs.png";
        this.logoLogin = "FundoHvs.png";
        this.logoInicio = "FundoHvs.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogofarms:
        this.clientes.cliente13 = true;
        this.nomeCatalogo = "Farms Catalog";
        this.logoSidebar = "farms_logo.png";
        this.logoLogin = "farms_logo.png";
        this.logoInicio = "farms_logo.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogoclx:
        this.clientes.cliente14 = true;
        this.nomeCatalogo = "CLX";
        this.logoSidebar = "clx.png";
        this.logoLogin = "clx.png";
        this.logoInicio = "clx.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogoawsmetal:
        this.clientes.cliente15 = true;
        this.nomeCatalogo = "Aws Metal & Mecânica";
        this.logoSidebar = "NavbarAwsMetal.png";
        this.logoLogin = "AwsMetal.png";
        this.logoInicio = "AwsMetal.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogoteste:
        this.clientes.cliente16 = true;
        this.nomeCatalogo = "Teste";
        this.logoSidebar = "clx.png";
        this.logoLogin = "clx.png";
        this.logoInicio = "clx.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogofrigorichter:
        this.clientes.cliente17 = true;
        this.nomeCatalogo = "Frigorichter";
        this.logoSidebar = "logo_frigorichter_circle.svg";
        this.logoLogin = "logo_frigorichter.png";
        this.logoInicio = "logo_frigorichter.png";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
      case Tenant.catalogofase:
        this.clientes.cliente18 = true;
        this.nomeCatalogo = "Fase";
        this.logoSidebar = "logo_fase3.svg";
        this.logoLogin = "logo_fase.svg";
        this.logoInicio = "logo_fase.svg";
        this.cadastrarCliente = true;
        this.pesquisaAvancada = true;
        break;
    }
    
    return this.clientes;
  }
}
