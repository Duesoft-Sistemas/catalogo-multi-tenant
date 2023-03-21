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

  constructor(
    private router: Router,
    private authStorageService: AuthStorageService,
    private serviceTenent : TenantService
  ) {
    this.verificaToken();
  }

  ngOnInit() {
    this.habilitaTema();
  }

  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;

  private habilitaTema() {
    this.client1Theme = this.serviceTenent.getTenant() === Tenant.catalogomendes;
    debugger
    this.client2Theme = this.serviceTenent.getTenant() === Tenant.catalogomaster;
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
