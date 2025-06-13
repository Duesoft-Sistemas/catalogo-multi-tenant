import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
 
import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from './shared/guards/auth-storage.service';
import { Tenant, TenantService } from './shared/tenant/tenant.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.skins.less'],
})
export class AppComponent {
  autenticado = false;
  favIcon: HTMLLinkElement = document.querySelector('#appIcone');
  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;
  // @HostBinding("class.autocar") public client3Theme: boolean;
  @HostBinding("class.microtec") public client4Theme: boolean;
  @HostBinding("class.mm") public client5Theme: boolean;
  @HostBinding("class.prudenseg") public client6Theme: boolean;
  @HostBinding("class.diskagua") public client7Theme: boolean;
  @HostBinding("class.prudentina") public client8Theme: boolean;
  @HostBinding("class.barone") public client9Theme: boolean;
  @HostBinding("class.atacado") public client10Theme: boolean;
  @HostBinding("class.farmsrugs") public client11Theme: boolean;
  @HostBinding("class.hvs") public client12Theme: boolean;
  @HostBinding("class.southair") public client13Theme: boolean;
  @HostBinding("class.clx") public client14Theme: boolean;
  @HostBinding("class.awsmetal") public client15Theme: boolean;
  @HostBinding("class.frigorichter") public client17Theme: boolean;
  @HostBinding("class.fase") public client18Theme: boolean;
  @HostBinding("class.teste") public client16Theme: boolean;
  constructor(
    private router: Router,
    private authStorageService: AuthStorageService,
    private serviceTenant : TenantService,
    private titleService: Title
  ) {
    this.verificaToken();
  }

  ngOnInit() {
    inject();
    injectSpeedInsights();
    this.habilitaTema();
  }

  private habilitaTema() {
    switch (this.serviceTenant.getTenant()) {
      case Tenant.catalogomendes:
        this.client1Theme = true;
        this.titleService.setTitle("Catálogo Mendes");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogomaster:
        this.client2Theme = true;
        this.titleService.setTitle("Catálogo Canguru");
        this.favIcon.href = 'favicon.ico';
        break;
      // case Tenant.catalogoautocar:
      //   this.client3Theme = true;
      //   this.titleService.setTitle("Catálogo Autocar");
      //   this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogomicrotec:
        this.client4Theme = true;
        this.titleService.setTitle("Catálogo Microtec");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogomm:
        this.client5Theme = true;
        this.titleService.setTitle("Catálogo MM");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogoprudenseg:
        this.client6Theme = true;
        this.titleService.setTitle("Catálogo Prudenseg");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogolm:
        this.client7Theme = true;
        this.titleService.setTitle("Catálogo Disk água");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogoprudentina:
        this.client8Theme = true;
        this.titleService.setTitle("Prudentina");
        this.favIcon.href = 'duesoft.ico';//'PrudentinaIco.ico';
        break;
      case Tenant.catalogobarone:
        this.client9Theme = true;
        this.titleService.setTitle("Barone");
        this.favIcon.href = 'faviconBarone.png';
        break;
      case Tenant.catalogoatacado:
        this.client10Theme = true;
        this.titleService.setTitle("Atacado");
        this.favIcon.href = 'Atacado.ico';
        break;
      case Tenant.catalogofarmsrugs:
        this.client11Theme = true;
        this.titleService.setTitle("Farms Rugs");
        this.favIcon.href = 'farms_rugs2.ico';
        break;
      case Tenant.catalogohvs:
        this.client12Theme = true;
        this.titleService.setTitle("Hvs");
        this.favIcon.href = 'hvs.ico';
        break;
      case Tenant.catalogofarms:
        this.client13Theme = true;
        this.titleService.setTitle("Farms Catalog");
        this.favIcon.href = 'farms2.ico';
        break;
      case Tenant.catalogoclx:
        this.client14Theme = true;
        this.titleService.setTitle("CLX");
        this.favIcon.href = 'clx.ico';
        break;
      case Tenant.catalogohvs:
        this.client15Theme = true;
        this.titleService.setTitle("Aws Metal & Mecânica");
        this.favIcon.href = 'aws_metal.ico';
        break;
      case Tenant.catalogoteste:
        this.client16Theme = true;
        this.titleService.setTitle("Catalogo Teste");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogofrigorichter:
        this.client17Theme = true;
        this.titleService.setTitle("Catalogo Frigorichter");
        this.favIcon.href = 'duesoft.ico';
        break;
      case Tenant.catalogofase:
        this.client18Theme = true;
        this.titleService.setTitle("Catalogo Fase");
        this.favIcon.href = 'fase.ico';
        break;
      
      default:
        console.log(`Sorry, tenant wrong.`);
    }
  }

  private verificaToken(): void {
    if (this.authStorageService.isLoggedIn()) {
      if (this.authStorageService.isTokenExpired()) {
        this.authStorageService.logout();
      } else {
        this.autenticado = true;
        // document.documentElement.style.setProperty('--color-primary', 'green');
        // document.documentElement.style.setProperty('--font-color', 'red');
      }
    } else {
      this.autenticado = false;
      this.router.navigate(['login']);
      // if (!window.location.href.includes(environment.UrlRedefinirSenha)) {
      //   this.router.navigate(['login']);
      // }
    }
  }
}
