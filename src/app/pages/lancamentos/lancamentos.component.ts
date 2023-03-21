import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { take } from 'rxjs';
import { FiltroPesquisarProdutos } from 'src/app/shared/classes/filtro-pesquisar-produtos';
import { FiltroProdutosComponent } from 'src/app/shared/components/filtro-produtos/filtro-produtos.component';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IProdutos } from 'src/app/shared/interface/IProdutos';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.css'],
})
export class LancamentosComponent implements OnInit {
  spinner = false;
  totalPaginas: number;
  listProdutos: IProdutos[] = [];
  modelo = new FiltroPesquisarProdutos();
  filtro = false;

  constructor(
    private service: GlobalService,
    public dialog: MatDialog,
    private storage: AuthStorageService
  ) {
    this.totalPaginas = 0;
    this.modelo.page = 1;
  }

  ngOnInit() {
    this.storage.setTitlePage('Lançamentos');
    this.buscarLancamentos();
  }

  buscar(): void {
    if (!this.filtro) {
      this.buscarLancamentos();
    } else {
      this.buscarProdutosFiltro();
    }
  }

  private buscarLancamentos(): void {
    this.spinner = true;
    this.service
      .getProdutosLancamentos(this.modelo.page)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.listProdutos = data.produtos;
            this.totalPaginas = data.totalPaginas;
            if (data.produtos.lengh <= 0) {
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

  goTo(event: PageChangedEvent): void {
    this.modelo.page = event.page;
    this.buscar();
  }

  private buscarProdutosFiltro(): void {
    this.spinner = true;
    this.service
      .getProdutosPesquisa(this.modelo)
      .pipe(take(1))
      .subscribe(
        (data) => {
          if (data) {
            this.listProdutos = data.produtos;
            this.totalPaginas = data.totalPaginas;
            if (data.produtos.lengh <= 0) {
              Toaster.Warning('Nenhum produto encontrado.');
            }
          } else {
            Toaster.Warning('Nenhum produto encontrado.');
          }
        },
        (error) => {
          Toaster.Error(error);
          this.spinner = false;
        },
        () => {
          this.spinner = false;
        }
      );
  }

  openModalFiltro() {
    const dialogRef = this.dialog.open(FiltroProdutosComponent, {
      data: {
        width: '200px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filtro = true;
        this.modelo = new FiltroPesquisarProdutos(result);
        this.buscarProdutosFiltro();
      }
    });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
