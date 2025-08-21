import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IProdutos } from 'src/app/shared/interface/IProdutos';
import { GlobalService } from 'src/app/shared/services/global.service';
import { TenantService } from 'src/app/shared/tenant/tenant.service';
import { FiltroPesquisarProdutos } from 'src/app/shared/classes/filtro-pesquisar-produtos';
import { FiltroProdutosComponent } from 'src/app/shared/components/filtro-produtos/filtro-produtos.component';
import { ModalPesquisaAvancadaComponent } from 'src/app/pages/iniciar/modal-pesquisa-avancada/modal-pesquisa-avancada.component';
import { FiltroPesquisaAvancada } from 'src/app/pages/iniciar/modal-pesquisa-avancada/filtro-pesquisa-avancada';

@Component({
  selector: 'app-promocoes',
  templateUrl: './promocoes.component.html',
  styleUrls: ['./promocoes.component.css'],
})
export class PromocoesComponent implements OnInit {
  schema = '';
  spinner = false;
  pagina: number;
  totalPaginas: number;
  listProdutos: IProdutos[] = [];
  filtroPesquisaAvancada = FiltroPesquisaAvancada;

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService,
    private tenantService: TenantService,
    private dialog: MatDialog
  ) {
    this.schema = this.tenantService.getSchemaTenant();
    this.schema = this.tenantService.getSchemaTenant();
    this.totalPaginas = 0;
    this.pagina = 1;
  }

  ngOnInit() {
    this.storage.setTitlePage('Promoções');
    this.buscarLancamentos();
  }

  goTo(event: PageChangedEvent): void {
    this.pagina = event.page;
    this.buscarLancamentos();
  }

  buscarLancamentos(): void {
    this.spinner = true;
    this.service
      .getProdutosPromocao(this.pagina)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.listProdutos = data.produtos;
            this.totalPaginas = data.totalPaginas;
            if (data.produtos.length <= 0) {
              Toaster.Warning('Nenhum produto encontrado.');
            }
          } else {
            Toaster.Warning('Nenhum produto encontrado.');
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

  // Método para lidar com mudanças na pesquisa
  onSearchChanged(filtro: FiltroPesquisarProdutos): void {
    // Para promoções, não implementamos pesquisa ainda
    // Pode ser implementado no futuro se necessário
  }

  // Método para lidar com atualizações dos produtos
  onProductsUpdated(produtos: IProdutos[]): void {
    this.listProdutos = produtos;
  }

  onNoProductsFound(message: string): void {
    Toaster.Warning(message);
  }

  // Método para recarregar o catálogo
  reloadCatalog(): void {
    // Recarregar o catálogo do início
    this.pagina = 1;
    this.buscarLancamentos();
  }

  // Método para abrir modal de filtros básicos
  openModalFiltro(): void {
    const dialogRef = this.dialog.open(FiltroProdutosComponent, {
      data: { width: '200px' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Para promoções, podemos implementar filtros específicos no futuro
        Toaster.Info('Funcionalidade de filtro será implementada em breve.');
      }
    });
  }

  // Método para abrir modal de pesquisa avançada
  openModalPesquisaAvancada(): void {
    const dialogRef = this.dialog.open(ModalPesquisaAvancadaComponent, {
      width: '90vw',
      maxWidth: '548px',
      data: { filtro: this.filtroPesquisaAvancada }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.produtos) {
          this.listProdutos = result.produtos;
          this.totalPaginas = result.totalPaginas;
          this.onProductsUpdated(this.listProdutos);
        }
        if (result.filtro?.flag) {
          this.filtroPesquisaAvancada = result.filtro;
        } else {
          this.filtroPesquisaAvancada.flag = false;
        }
      }
    });
  }
}
