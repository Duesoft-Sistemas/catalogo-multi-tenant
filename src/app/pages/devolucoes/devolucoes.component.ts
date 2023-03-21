import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IDevolucoes } from 'src/app/shared/interface/IDevolucoes';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-devolucoes',
  templateUrl: './devolucoes.component.html',
  styleUrls: ['./devolucoes.component.css'],
})
export class DevolucoesComponent implements OnInit {
  spinner = false;
  columns = [
    {
      columnDef: 'pedido',
      header: 'Pedido Nº',
      cell: (element: IDevolucoes) => `${element.codPedido}`,
      style: { width: '150px' },
    },
    {
      columnDef: 'data',
      header: 'Data',
      cell: (element: IDevolucoes) => `${element.orderDate ?? '-'}`,
      style: { width: '150px' },
    },
    {
      columnDef: 'codProduto',
      header: 'Código Produto',
      cell: (element: IDevolucoes) => `${element.dsCodProduto}`,
      style: { width: '100px' },
    },
    {
      columnDef: 'produto',
      header: 'Produto',
      cell: (element: IDevolucoes) => `${element.produto}`,
    },
    {
      columnDef: 'valor',
      header: 'Valor',
      cell: (element: IDevolucoes) => `${element.totalPrice}`,
      currency: true,
      style: { width: '150px' },
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: IDevolucoes) =>
        `${element.faturado ? 'Faturado' : 'Não Faturado'}`,
      style: { width: '150px' },
    },
  ];
  dataSource: MatTableDataSource<IDevolucoes> =
    new MatTableDataSource<IDevolucoes>();
  constructor(
    private service: GlobalService,
    private storage: AuthStorageService
  ) {}

  ngOnInit() {
    this.getDados();
    this.storage.setTitlePage('Devoluções');
  }

  private getDados(): void {
    this.spinner = true;
    this.service
      .getDevolucoes()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.dataSource = new MatTableDataSource<IDevolucoes>(data);
            if (data.lenght <= 0) {
              Toaster.Warning('Nenhuma devolução encontrada.');
            }
          } else {
            Toaster.Warning('Nenhuma devolução encontrada.');
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
