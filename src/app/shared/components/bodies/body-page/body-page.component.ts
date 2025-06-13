import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { SeletorPeculiaridadesCatalogos } from 'src/app/shared/classes/seletor-peculiaridades-catalogos';
import { TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-body-page',
  templateUrl: './body-page.component.html',
  styleUrls: ['./body-page.component.css'],
})
export class BodyPageComponent implements OnInit {
  @Input() spinner?: boolean;
  @Input() title: string;
  @Input() update: boolean;
  @Input() showBody: boolean;
  @Input() showFooter: boolean;
  @Input() schema?: string;
  inicialPage: boolean;
  canGoBack: boolean;
  listPages: string[] = [];
  verify: string;

  seletorPeculiaridadesCatalogos: SeletorPeculiaridadesCatalogos;

  constructor(
    private serviceTenant: TenantService,
    private router: Router,
    private location: Location,
    private storage: AuthStorageService
  ) {
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(
      this.serviceTenant
    );
    this.showBody = true;
    this.showFooter = false;
    var caminho = this.router
      .getCurrentNavigation()
      ?.previousNavigation?.finalUrl?.toString();
    let data = this.storage.getDataStorage();
    if (undefined != caminho && caminho !== '/login' && !data.desactiveGoBack) {
      data.navigationList.push(caminho);
      this.storage.setDataStorage(data);
    } else {
      if (!data.desactiveGoBack) {
        data.navigationList = [];
        this.storage.setDataStorage(data);
      } else {
        data.desactiveGoBack = false;
        this.storage.setDataStorage(data);
      }
    }
    this.inicialPage =
      this.router.url == '/inicio' ||
      this.router.url == '/login' ||
      data.navigationList.length < 1
        ? false
        : true;
  }

  ngOnInit() {
    this.seletorPeculiaridadesCatalogos.getTenant();
  }

  goBack() {
    const data = this.storage.getDataStorage();
    if (data.navigationList.length > 0) {
      data.navigationList.pop();
      data.desactiveGoBack = true;
      this.storage.setDataStorage(data);
      this.location.back();
    }
  }
}
