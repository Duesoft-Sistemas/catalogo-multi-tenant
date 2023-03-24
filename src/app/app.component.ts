import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from './shared/guards/auth-storage.service';
import { Tenant, TenantService } from './shared/tenant/tenant.service';
import {Title} from "@angular/platform-browser";

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
  @HostBinding("class.autocar") public client3Theme: boolean;
  @HostBinding("class.microtec") public client4Theme: boolean;
  @HostBinding("class.mm") public client5Theme: boolean;
  @HostBinding("class.prudenseg") public client6Theme: boolean;
  @HostBinding("class.diskagua") public client7Theme: boolean;

  constructor(
    private router: Router,
    private authStorageService: AuthStorageService,
    private serviceTenant : TenantService,
    private titleService:Title
    ) {
    this.verificaToken();
  }

  ngOnInit() {
    this.habilitaTema();
    this.alteraFaviconNomeCatalogo();
  }

  private habilitaTema() {
    this.client1Theme = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.client2Theme = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.client3Theme = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.client4Theme = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.client5Theme = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.client6Theme = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.client7Theme = this.serviceTenant.getTenant() === Tenant.catalogolm;
  }

  private alteraFaviconNomeCatalogo() {
    if(this.client1Theme){
      this.titleService.setTitle("Catálogo Mendes");
      this.favIcon.href = 'duesoft.ico';
    }else
    if(this.client2Theme){
      this.titleService.setTitle("Catálogo Canguru");
      this.favIcon.href = 'favicon.ico';
    }else
    if(this.client3Theme){
      this.titleService.setTitle("Catálogo Autocar");
      this.favIcon.href = 'duesoft.ico';
    }else
    if(this.client4Theme){
      this.titleService.setTitle("Catálogo Microtec");
      this.favIcon.href = 'duesoft.ico';
    }else
    if(this.client5Theme){
      this.titleService.setTitle("Catálogo MM");
      this.favIcon.href = 'duesoft.ico';
    }else
    if(this.client6Theme){
      this.titleService.setTitle("Catálogo Prudenseg");
      this.favIcon.href = 'duesoft.ico';
    }else
    if(this.client7Theme){
      this.titleService.setTitle("Catálogo Disk água");
      this.favIcon.href = 'duesoft.ico';
    }
  }

  private verificaToken(): void {
    if (this.authStorageService.isLoggedIn()) {
      if (this.authStorageService.isTokenExpired()) {
        this.authStorageService.logout();
      } else {
        this.autenticado = true;
        //  document.documentElement.style.setProperty('--color-primary', 'green');
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
