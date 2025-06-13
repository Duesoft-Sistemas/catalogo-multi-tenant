import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ProdutoCarrinho } from 'src/app/shared/classes/produto-carrinho';
import { SeletorPeculiaridadesCatalogos } from 'src/app/shared/classes/seletor-peculiaridades-catalogos';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { TableActions } from 'src/app/shared/enums/table-actions.enum';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Table } from 'src/app/shared/functions/table';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { ICarrinho } from 'src/app/shared/interface/ICarrinho';
import { ITableAction } from 'src/app/shared/interface/ITableAction';
import { GlobalService } from 'src/app/shared/services/global.service';
import { TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-concluir-pedido',
  templateUrl: './concluir-pedido.component.html',
  styleUrls: ['./concluir-pedido.component.css'],
})
export class ConcluirPedidoComponent implements OnInit {
  schema = '';
  spinner = false;
  imgPadraoProduto = '../../../assets/images/imagem_nao_encontrada.jpg';
  form: FormGroup;

  seletorPeculiaridadesCatalogos: SeletorPeculiaridadesCatalogos;

  columns = [
    {
      columnDef: 'remove',
      header: 'Remover',
      remove: true,
    },
    {
      columnDef: 'img',
      header: 'Imagem',
      cell: (element: ProdutoCarrinho) =>
        `${
          element.produto.image.includes('./static/')
            ? this.imgPadraoProduto
            : element.produto.image
        }`,
      img: true,
    },
    {
      columnDef: 'codigo',
      header: 'Código',
      cell: (element: ProdutoCarrinho) => `${element.produto.code ?? '-'}`,
    },
    {
      columnDef: 'descricao',
      header: 'Descrição',
      cell: (element: ProdutoCarrinho) =>
        `${element.produto.description ?? '-'}`,
    },
    {
      columnDef: 'valor',
      header: 'Valor',
      cell: (element: ProdutoCarrinho) =>
        `${
          element.produto.unidadeEscolhida === element.produto.unity
            ? Number(element.produto.price) * element.quantidade
            : Number(element.produto.price2) * element.quantidade
        }`,
      currency: true,
    },
    {
      columnDef: 'actions',
      header: 'Quantidade',
      actions: true,
    },
  ];

  dataSource: MatTableDataSource<ProdutoCarrinho> =
    new MatTableDataSource<ProdutoCarrinho>();
  action = new EventEmitter<ITableAction>();
  displayedColumns?: string[];
  tableActions = TableActions;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private serviceTenant: TenantService,
    private service: GlobalService,
    private storage: AuthStorageService,
    public dialog: MatDialog
  ) {
    this.schema = this.serviceTenant.getSchemaTenant();
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(
      this.serviceTenant
    );
    this.form = Formularios.geraFormulario(new ProdutoCarrinho());
  }

  ngOnInit() {
    this.seletorPeculiaridadesCatalogos.getTenant();
    this.storage.setTitlePage('Concluir Pedido');
    this.atualizaTabela();
  }

  ngAfterViewInit() {
    Table.translateTable(this.paginator);
    Table.atualizaTable(this.dataSource, this.paginator);
  }

  private atualizaTabela(): void {
    this.dataSource = new MatTableDataSource(this.storage.getCarrinho());
    this.dataSource.filteredData.forEach((produto) => {
      produto.produto.price = produto.produto.price
        .toString()
        .replace(',', '.');
      if (produto.produto.price2 != null && produto.produto.price2 != '')
        produto.produto.price2 = produto.produto.price2
          .toString()
          .replace(',', '.');
    });
    this.displayedColumns = this.columns?.map((c) => c.columnDef);
    Table.atualizaTable(this.dataSource, this.paginator);
  }

  remover(row: ProdutoCarrinho): void {
    this.storage.removeProdutoCarrinho(row);
    this.atualizaTabela();
  }

  getPrice(produto: any, quantidade: number): number {
    if (produto.unidadeEscolhida === produto.unity)
      return Number(produto.price) * quantidade;
    else return Number(produto.price2) * quantidade;
  }

  getTotal(): any {
    let total = 0;
    this.dataSource.data.map((x) => {
      if (x.produto.unidadeEscolhida === x.produto.unity2) {
        total += x.quantidade * +x.produto.price2.toString().replace(',', '.');
      } else
        total += x.quantidade * +x.produto.price.toString().replace(',', '.');
    });
    return total.toFixed(2);
  }

  openModalConfirmConcluir(): void {
    if (this.dataSource.data.length > 0) {
      let dialog = this.dialog.open(ModalConfirmComponent, {
        width: '350px',
        data: {
          title: 'Confirmar Pedido ?',
          subTitle: `Total R$ ${this.getTotal().replace('.', ',')}`,
        },
      });

      dialog.afterClosed().subscribe((result) => {
        if (result) {
          let carrinho = this.storage
            .getCarrinho()
            .map((x) => new ProdutoCarrinho(x).getItem());
          this.concluir(carrinho);
        }
      });
    } else Toaster.Warning('Carrinho vazio!');
  }

  private concluir(itens: ICarrinho[]): void {
    this.spinner = true;
    this.service
      .concluirPedido(itens, this.form.get('observacao')?.value)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          this.spinner = false;
          this.storage.limpaCarrinho();
          this.atualizaTabela();
          Toaster.Success(
            'Pedido enviado com sucesso. Você será notificado assim que o pedido for avaliado.'
          );
        },
        error: (error) => {
          this.spinner = false;
          Toaster.Error(
            'Não foi possível enviar o pedido. Entre em contato com seu fornecedor.'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
