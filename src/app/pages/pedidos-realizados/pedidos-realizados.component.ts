import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { FiltroPedidosRealizados } from 'src/app/shared/classes/filtro-pedidos-realizados';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IPedidos } from 'src/app/shared/interface/IPedidos';
import { IPedidosRealizados } from 'src/app/shared/interface/IPedidosRealizados';
import { GlobalService } from 'src/app/shared/services/global.service';
import { PedidosRealizadosDetalhesComponent } from './pedidos-realizados-detalhes/pedidos-realizados-detalhes.component';
import { PedidosRealizadosFiltroComponent } from './pedidos-realizados-filtro/pedidos-realizados-filtro.component';
import { TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-pedidos-realizados',
  templateUrl: './pedidos-realizados.component.html',
  styleUrls: ['./pedidos-realizados.component.css'],
})
export class PedidosRealizadosComponent implements OnInit {
  schema = '';
  spinner = false;
  columns = [
    {
      columnDef: 'solicitacao',
      header: 'Solicitação Nº',
      cell: (element: IPedidos) => `${element.solicitationNumber}`,
    },
    {
      columnDef: 'pedido',
      header: 'Pedido Nº',
      cell: (element: IPedidos) =>
        `${element.orderNumber == 0 ? '-' : element.orderNumber}`,
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: IPedidos) => `${element.status}`,
    },
    {
      columnDef: 'data',
      header: 'Data',
      cell: (element: IPedidos) => `${element.orderDate}`,
    },
    {
      columnDef: 'valor',
      header: 'Valor',
      cell: (element: IPedidos) => `${element.totalPrice}`,
      currency: true,
    },
  ];

  dataSource: MatTableDataSource<IPedidos> = new MatTableDataSource<IPedidos>();
  filtro: FiltroPedidosRealizados = new FiltroPedidosRealizados();

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService,
    public dialog: MatDialog,
    private serviceTenant: TenantService
  ) {
    this.schema = this.serviceTenant.getSchemaTenant();
  }

  ngOnInit() {
    this.storage.setTitlePage('Meus Pedidos');
    this.getDados();
  }

  openModalDetalhes(dados: IPedidosRealizados): void {
    const dialogRef = this.dialog.open(PedidosRealizadosDetalhesComponent, {
      data: dados.solicitationNumber,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getDados();
    });
  }

  openModalFiltro(): void {
    const dialogRef = this.dialog.open(PedidosRealizadosFiltroComponent, {
      width: '300px',
      data: this.filtro,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filtro = new FiltroPedidosRealizados(result);
        this.getDadosFiltros();
      }
    });
  }

  private getDados(): void {
    this.spinner = true;
    this.service
      .getPedidosRealizados()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            data.sort((a, b) => {
              return b.solicitationNumber - a.solicitationNumber;
            });
            this.dataSource = new MatTableDataSource<IPedidos>(data);

            if (data.length <= 0) {
              Toaster.Warning('Nenhum pedido encontrado.');
            }
          } else {
            Toaster.Warning('Nenhum pedido encontrado.');
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

  private getDadosFiltros(): void {
    this.spinner = true;
    this.service
      .filtrarPedidosRealizados(this.filtro)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.dataSource = new MatTableDataSource<IPedidos>(data ?? []);
          this.dataSource.filter = '';
          if (!data || data.lenght <= 0) {
            Toaster.Warning('Nenhum pedido encontrado.');
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
}
