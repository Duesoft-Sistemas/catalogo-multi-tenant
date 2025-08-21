import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FiltroPesquisarProdutos } from 'src/app/shared/classes/filtro-pesquisar-produtos';
import { FiltroProdutosComponent } from 'src/app/shared/components/filtro-produtos/filtro-produtos.component';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IProdutos } from 'src/app/shared/interface/IProdutos';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FiltroPesquisaAvancada } from '../iniciar/modal-pesquisa-avancada/filtro-pesquisa-avancada';
import { ModalPesquisaAvancadaComponent } from '../iniciar/modal-pesquisa-avancada/modal-pesquisa-avancada.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SeletorPeculiaridadesCatalogos } from 'src/app/shared/classes/seletor-peculiaridades-catalogos';
import { TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-pesquisar-produtos',
  templateUrl: './pesquisar-produtos.component.html',
  styleUrls: ['./pesquisar-produtos.component.css'],
})
export class PesquisarProdutosComponent implements OnInit {
  schema = '';
  spinner = false;
  totalPaginas: number;
  listProdutos: IProdutos[] = [];
  modelo = new FiltroPesquisarProdutos();

  seletorPeculiaridadesCatalogos: SeletorPeculiaridadesCatalogos;

  filtroPesquisaAvancada = FiltroPesquisaAvancada;

  constructor(
    private serviceTenant: TenantService,
    private service: GlobalService,
    public dialog: MatDialog,
    private storage: AuthStorageService,
    private sanitizer: DomSanitizer
  ) {
    this.schema = this.serviceTenant.getSchemaTenant();
    this.schema = this.serviceTenant.getSchemaTenant();
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(
      this.serviceTenant
    );
    this.totalPaginas = 0;
    this.modelo.page = 1;
  }

  ngOnInit() {
    this.seletorPeculiaridadesCatalogos.getTenant();
    this.storage.setTitlePage('Produtos');
    this.buscarProdutosFiltro();
  }

  goTo(event: any): void {
    // Lidar com tanto o evento antigo quanto o novo
    const page = event.page || event;
    this.modelo.page = page;
    this.buscarProdutosFiltro();
  }

  openModalPesquisaAvancada(): void {
    const dialogRef = this.dialog.open(ModalPesquisaAvancadaComponent, {
      width: '90vw',
      maxWidth: '548px',
      data: {
        filtro: this.filtroPesquisaAvancada,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.produtos) {
          this.listProdutos = result.produtos;
          this.listProdutos.forEach((produto) => {
            if (produto.image != './static/img/imagem_nao_encontrada.jpg') {
              produto.imageSafe = this.sanitizer.bypassSecurityTrustUrl(
                produto.image
              );
            }
          });
          this.totalPaginas = result.totalPaginas;
        }
        if (result.filtro.flag) {
          this.filtroPesquisaAvancada = result.filtro;
        } else {
          this.filtroPesquisaAvancada.flag = false;
        }
      }
    });
  }

  openModalFiltro(): void {
    const dialogRef = this.dialog.open(FiltroProdutosComponent, {
      data: {
        width: '200px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.modelo = new FiltroPesquisarProdutos(result);
        this.buscarProdutosFiltro();
      }
    });
  }

  private buscarProdutosFiltro(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.spinner = true;
      this.service
        .getProdutosPesquisa(this.modelo)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data) {
              resolve(data);
              this.listProdutos = data.produtos;
              this.listProdutos.forEach((produto) => {
                if (produto.image != './static/img/imagem_nao_encontrada.jpg') {
                  produto.imageSafe = this.sanitizer.bypassSecurityTrustUrl(
                    produto.image
                  );
                }
              });
              this.totalPaginas = data.totalPaginas;
              if (data.produtos.length <= 0) {
                Toaster.Warning('Nenhum produto encontrado.');
              }
            } else {
              Toaster.Warning('Nenhum produto encontrado.');
              resolve(null);
            }
          },
          error: (error: any) => {
            reject(error);
            Toaster.Error(error);
            this.spinner = false;
          },
          complete: () => {
            this.spinner = false;
          },
        });
    });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

  // Método para lidar com mudanças na pesquisa
  onSearchChanged(filtro: FiltroPesquisarProdutos): void {
    this.modelo = filtro;
    this.buscarProdutosFiltro();
  }

  // Método para lidar com atualizações dos produtos
  onProductsUpdated(produtos: IProdutos[]): void {
    this.listProdutos = produtos;
  }

  // Método para lidar quando não há produtos encontrados
  onNoProductsFound(message: string): void {
    Toaster.Warning(message);
  }

  // Método para recarregar o catálogo
  reloadCatalog(): void {
    // Recarregar o catálogo do início
    this.modelo = new FiltroPesquisarProdutos();
    this.modelo.page = 1;
    this.buscarProdutosFiltro();
  }
}
