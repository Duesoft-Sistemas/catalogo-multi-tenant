import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from './shared/guards/auth-storage.service';
import { Tenant, TenantService } from './shared/tenant/tenant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.skins.less'],
})
export class AppComponent {
  autenticado = false;
  client3Theme: boolean;
  client4Theme: boolean;
  client5Theme: boolean;
  client6Theme: boolean;
  client7Theme: boolean;

  constructor(
    private router: Router,
    private authStorageService: AuthStorageService,
    private serviceTenant : TenantService
  ) {
    this.verificaToken();
  }

  ngOnInit() {
    this.habilitaTema();
  }

  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;

  private habilitaTema() {
    this.client1Theme = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.client2Theme = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.client3Theme = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.client4Theme = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.client5Theme = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.client6Theme = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.client7Theme = this.serviceTenant.getTenant() === Tenant.catalogodiskagua;
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
