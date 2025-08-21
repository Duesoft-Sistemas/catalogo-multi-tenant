import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { take } from 'rxjs';
import { PesquisaEsteiraClass } from '../../classes/pesquisa-esteira-class';
import { Formularios } from '../../functions/formularios';
import { Toaster } from '../../functions/toaster';
import { IProdutos } from '../../interface/IProdutos';
import { GlobalService } from '../../services/global.service';
import { FiltroPesquisarProdutos } from '../../classes/filtro-pesquisar-produtos';

@Component({
  selector: 'app-lista-fornecedores',
  templateUrl: './lista-fornecedores.component.html',
})
export class ListaFornecedoresComponent implements OnInit {
  spinner = true;
  @Input() listFornecedores;
  @Input() totalPaginas: number;
  maxSizePaginator = 5;
  imgPadraoMarca = '../../../assets/images/sem_foto.png';
  listProdutos: IProdutos[] = [];
  formEsteira: FormGroup;
  @Output() pageChanged = new EventEmitter();
  @Output() productCountChanged = new EventEmitter<number>();
  toogleClick = false;
  descricao: string;

  constructor(private service: GlobalService, public dialog: MatDialog) {}

  ngOnInit() {
    this.spinner = false;
    this.formEsteira = Formularios.geraFormulario(new PesquisaEsteiraClass());
  }

  goTo(event: PageChangedEvent): void {
    this.formEsteira.get('page').setValue(event.page);
    this.getListaProdutos(this.descricao);
  }

  getListaProdutos(id: any) {
    this.spinner = true;
    this.descricao = id.toString();
    this.service
      .getProdutosFornecedores(this.getDataBusca())
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.listProdutos = data.produtos;
            this.formEsteira.get('totalPages').setValue(data.totalPaginas);
            // Emitir a contagem de produtos
            this.productCountChanged.emit(this.listProdutos.length);
            if (data.produtos.length <= 0)
              Toaster.Warning('Nenhum produto encontrado.');
          } else Toaster.Warning('Nenhum produto encontrado.');
        },
        error: (error) => {
          Toaster.Error('Nenhum produto encontrado.');
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  private getDataBusca(): any {
    return { Code: this.descricao, Page: +this.formEsteira.get('page').value };
  }

  // Método para lidar com mudanças na pesquisa
  onSearchChanged(filtro: FiltroPesquisarProdutos): void {
    // Para lista de fornecedores, não implementamos pesquisa ainda
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
    // Recarregar o catálogo do fornecedor selecionado
    if (this.descricao) {
      this.formEsteira.get('page').setValue(1);
      this.getListaProdutos(this.descricao);
    }
  }
}
