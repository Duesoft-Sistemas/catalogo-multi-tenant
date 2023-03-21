import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IProdutos } from 'src/app/shared/interface/IProdutos';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-promocoes',
  templateUrl: './promocoes.component.html',
  styleUrls: ['./promocoes.component.css']
})
export class PromocoesComponent implements OnInit {
  spinner = false;
  pagina: number;
  totalPaginas: number;
  listProdutos: IProdutos[] = [];

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService
  ) {
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
        complete: () => { this.spinner = false; }
      });
  }
}
