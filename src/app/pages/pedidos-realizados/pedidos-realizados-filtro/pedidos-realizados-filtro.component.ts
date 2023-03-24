import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { FiltroPedidosRealizados } from 'src/app/shared/classes/filtro-pedidos-realizados';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Formularios } from 'src/app/shared/functions/formularios';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { Tenant, TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-pedidos-realizados-filtro',
  templateUrl: './pedidos-realizados-filtro.component.html',
  styleUrls: ['./pedidos-realizados-filtro.component.css', './pedidos-realizados-filtro.component.skins.less'],
})
export class PedidosRealizadosFiltroComponent implements OnInit {
  formulario: FormGroup;
  listStatus: any[] = [];
  loadListStatus = true;
  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;
  @HostBinding("class.autocar") public client3Theme: boolean;
  @HostBinding("class.microtec") public client4Theme: boolean;
  @HostBinding("class.mm") public client5Theme: boolean;
  @HostBinding("class.prudenseg") public client6Theme: boolean;
  @HostBinding("class.diskagua") public client7Theme: boolean;

  constructor(
    public dialogRef: MatDialogRef<FiltroPedidosRealizados>,
    @Inject(MAT_DIALOG_DATA) public filtro: any,
    private serviceTenant: TenantService,
    private localeService: BsLocaleService,
    public dialog: MatDialog,
    private service: GlobalService
  ) {
    ptBrLocale.invalidDate = 'Insira uma data válida';
    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');
    this.getListaStatus();
    this.formulario = Formularios.geraFormulario(
      new FiltroPedidosRealizados(filtro)
    );
  }

  buscar(): void {
    this.dialogRef.close(new FiltroPedidosRealizados(this.formulario.value));
  }

  limpar(): void {
    this.formulario = Formularios.geraFormulario(new FiltroPedidosRealizados());
  }

  private getListaStatus(): void {
    this.service
      .getStatusPedidos()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.listStatus = data;
            this.loadListStatus = false;
          } else {
            Toaster.Error(
              'Não foi possivel carregar lista de status de pedidos.'
            );
          }
        },
        error: (error) => Toaster.Error(Toaster.msg.ErroCarregarDados),
      });
  }

  ngOnInit() {
    this.habilitaTema();
  }

  habilitaTema(){
    this.client1Theme = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.client2Theme = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.client3Theme = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.client4Theme = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.client5Theme = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.client6Theme = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.client7Theme = this.serviceTenant.getTenant() === Tenant.catalogolm;
  }
}
