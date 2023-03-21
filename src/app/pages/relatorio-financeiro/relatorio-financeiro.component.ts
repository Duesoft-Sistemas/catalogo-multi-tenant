import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { FiltroRelatorioFinanceiro } from 'src/app/shared/classes/filtro-relatorio-financeiro';
import { TableActions } from 'src/app/shared/enums/table-actions.enum';
import { Table } from 'src/app/shared/functions/table';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IRelatorioFinanceiro } from 'src/app/shared/interface/IRelatorioFinanceiro';
import { GlobalService } from 'src/app/shared/services/global.service';
import { RelatorioFinanceiroFiltroComponent } from './relatorio-financeiro-filtro/relatorio-financeiro-filtro.component';

@Component({
  selector: 'app-relatorio-financeiro',
  templateUrl: './relatorio-financeiro.component.html',
  styleUrls: ['./relatorio-financeiro.component.css'],
})
export class RelatorioFinanceiroComponent implements OnInit {
  spinner = false;
  columns: any[] = [
    {
      columnDef: 'documento',
      header: 'Documento',
      cell: (element: IRelatorioFinanceiro) => `${element.documento}`,
    },
    {
      columnDef: 'data',
      header: 'Data',
      cell: (element: IRelatorioFinanceiro) => `${element.dtConta}`,
    },
    {
      columnDef: 'vencimento',
      header: 'Vencimento',
      cell: (element: IRelatorioFinanceiro) => `${element.dtVencto}`,
    },
    {
      columnDef: 'pagamento',
      header: 'Pagamento',
      cell: (element: IRelatorioFinanceiro) => `${element.dtPagto}`,
    },
    {
      columnDef: 'valor',
      header: 'Valor',
      cell: (element: IRelatorioFinanceiro) => `${element.vl}`,
    },
    {
      columnDef: 'valorPago',
      header: 'Valor Pago',
      cell: (element: IRelatorioFinanceiro) => `${element.vlPago}`,
    },
  ];

  dataSource: MatTableDataSource<IRelatorioFinanceiro> =
    new MatTableDataSource<IRelatorioFinanceiro>();
  displayedColumns?: string[];
  tableActions = TableActions;
  totalPaginas = 0;
  pageSize = 0;
  filtro: FiltroRelatorioFinanceiro = new FiltroRelatorioFinanceiro();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.displayedColumns = this.columns?.map((c) => c.columnDef);
    this.storage.setTitlePage('Relatório Financeiro');
    this.getDados();
  }

  ngAfterViewInit() {
    Table.translateTableExibirPorPagina(this.paginator);
  }

  navegaTable(event: any): void {
    this.filtro.pagina = event.pageIndex + 1;
    this.getDados();
  }

  openModalFiltro(): void {
    const dialogRef = this.dialog.open(RelatorioFinanceiroFiltroComponent, {
      width: '300px',
      data: this.filtro,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filtro = new FiltroRelatorioFinanceiro(result);
        this.filtro.pagina = 1;
        this.getDados();
      }
    });
  }

  private getDados(): void {
    this.spinner = true;
    this.service
      .getRelatorioFinanceiro(this.filtro)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.totalPaginas = data.totalPaginas;
            this.pageSize =
              data.historico.length > 12 ? 12 : data.historico.length;
            this.paginator.pageIndex = this.filtro.pagina - 1;
            this.dataSource = new MatTableDataSource<IRelatorioFinanceiro>(
              data.historico
            );
            if (data.lenght <= 0) {
              Toaster.Warning('Nenhum dado encontrado.');
            }
          } else {
            Toaster.Warning('Nenhum dado encontrado.');
          }
        },
        error: (error) => {
          Toaster.Error('Nenhum dado encontrado.');
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
