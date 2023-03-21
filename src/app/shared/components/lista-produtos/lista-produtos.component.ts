import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Toaster } from '../../functions/toaster';
import { IProdutos } from '../../interface/IProdutos';
import { GlobalService } from '../../services/global.service';
import { AdicionarCarrinhoComponent } from '../adicionar-carrinho/adicionar-carrinho.component';
import { DetalhesProdutosComponent } from '../detalhes-produtos/detalhes-produtos.component';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css'],
})
export class ListaProdutosComponent implements OnInit {
  imgPadraoProduto = '../../../assets/images/imagem_nao_encontrada.jpg';
  imgPadraoMarca = '../../../assets/images/sem_foto.png';

  maxSizePaginator = 5;
  spinner = false;
  toogleClick = false;

  @Input() listProdutos: IProdutos[];
  @Input() totalPaginas: number;
  @Input() detalhes?: boolean;

  @Output() pageChanged = new EventEmitter();

  constructor(public dialog: MatDialog, private service: GlobalService) {
    this.maxSizePaginator = window.innerWidth > 575 ? 5 : 1;
  }

  ngOnInit() {}

  getPrice(price: any): number {
    return price.toString()?.replace(',', '.') as number;
  }

  openDetalhes(dados: IProdutos) {
    this.dialog
      .open(DetalhesProdutosComponent, {
        data: {
          detalhes: dados,
        },
      })
      .updatePosition({ top: '60px' });
  }

  openAdicionarCarrinho(dados: IProdutos) {
    if (dados.stock > 0) {
      this.dialog.open(AdicionarCarrinhoComponent, {
        width: '650px',
        data: {
          detalhes: dados,
        },
      });
    } else {
      Toaster.Warning('Produto sem estoque disponível!');
    }
  }

  getDetalhes(produto: IProdutos, tipo): void {
    if (!this.toogleClick) {
      this.toogleClick = !this.toogleClick;
      this.spinner = true;
      this.service
        .getDetalhesProduto(produto.id)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.spinner = false;
            if (data) {
              this.toogleClick = !this.toogleClick;
              tipo === 'D'
                ? this.openDetalhes(data)
                : this.openAdicionarCarrinho(data);
            } else Toaster.Warning('Detalhes não encontrados.');
          },
          error: () => {
            this.spinner = false;
            Toaster.Error(
              'Ocorreu um erro ao pesquisar os detalhes do produto selecionado.'
            );
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
