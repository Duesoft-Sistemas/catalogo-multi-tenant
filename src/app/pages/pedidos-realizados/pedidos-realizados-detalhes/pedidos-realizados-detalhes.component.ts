import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { IItensPedidosRealizadosDetalhes, IPedidosRealizadosDetalhes } from 'src/app/shared/interface/IPedidosRealizadosDetalhes';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { Tenant, TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-pedidos-realizados-detalhes',
  templateUrl: './pedidos-realizados-detalhes.component.html',
  styleUrls: ['./pedidos-realizados-detalhes.component.css', './pedidos-realizados-detalhes.component.skins.less'],
})
export class PedidosRealizadosDetalhesComponent implements OnInit {
  spinner = true;
  dados: IPedidosRealizadosDetalhes;
  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;
  @HostBinding("class.autocar") public client3Theme: boolean;
  @HostBinding("class.microtec") public client4Theme: boolean;
  @HostBinding("class.mm") public client5Theme: boolean;
  @HostBinding("class.prudenseg") public client6Theme: boolean;
  @HostBinding("class.diskagua") public client7Theme: boolean;

  columns = [
    {
      columnDef: 'produto',
      header: 'Produto',
      cell: (element: IItensPedidosRealizadosDetalhes) =>
        `${element.code}-${element.description}`,
    },
    {
      columnDef: 'quantidade',
      header: 'Qtde',
      cell: (element: IItensPedidosRealizadosDetalhes) =>
        `${element.appQtd}/${element.unity}`,
    },
    {
      columnDef: 'valor',
      header: 'Valor',
      cell: (element: IItensPedidosRealizadosDetalhes) =>
        `${this.getPrice(element.appTotalPrice)}`,
      currency: true,
    },
    {
      columnDef: 'total',
      header: 'Total',
      cell: (element: IItensPedidosRealizadosDetalhes) =>
        `${this.getPrice(element.appTotalPrice)}`,
      currency: true,
    },
  ];
  dataSource: MatTableDataSource<IItensPedidosRealizadosDetalhes> =
    new MatTableDataSource<IItensPedidosRealizadosDetalhes>();

  constructor(
    public dialogRef: MatDialogRef<PedidosRealizadosDetalhesComponent>,
    @Inject(MAT_DIALOG_DATA) public solicitationNumber: number,
    private service: GlobalService,
    private dialog: MatDialog,
    private serviceTenant: TenantService,
    private localeService: BsLocaleService
  ) {
    ptBrLocale.invalidDate = 'Insira uma data válida';
    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');
    this.getDados();
  }

  ngOnInit() {
    this.habilitaTema();
  }

  getDados(): void {
    this.service
      .detalhesPedidosRealizados(this.solicitationNumber)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.dados = data;
          this.dataSource =
            new MatTableDataSource<IItensPedidosRealizadosDetalhes>(data.itens);
          if (data) {
            if (data.lengh <= 0) {
              Toaster.Warning('Nenhum dado encontrado.');
            }
          } else {
            Toaster.Warning('Nenhum dado encontrado.');
          }
        },
        error: (error) => {
          Toaster.Error(error);
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  openModalConfirmarCancelarpedido(): void {
    let dialog = this.dialog.open(ModalConfirmComponent, {
      width: '350px',
      data: {
        title: 'Cancelar Pedido ?',
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) this.cancelarPedido().then((x) => this.dialogRef.close(true));
    });
  }

  cancelarPedido(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.spinner = true;
      this.service
        .cancelarPedido(this.dados.solicitationNumber)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            this.spinner = false;
            if (data) {
              Toaster.Info(data);
              resolve(true);
            } else {
              Toaster.Warning(
                'Não foi possível cancelar o pedido. Entre em contato com seu fornecedor.'
              );
              resolve(false);
            }
          },
          error: (error) => {
            this.spinner = false;
            Toaster.Error(
              error.text ??
                'Ocorreu um erro ao efetuar uma requisição de dados. Entre em contato com seu fornecedor.'
            );
            reject(false);
          },
        });
    });
  }

  getPrice(price: any): number {
    return price?.replace(',', '.') as number;
  }

  getDate(date: any): Date {
    var parts = date.split('/');
    parts[2] = '20'.concat(parts[2]);
    let data = new Date(parts[2], parts[0] - 1, parts[1]);
    return data;
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
