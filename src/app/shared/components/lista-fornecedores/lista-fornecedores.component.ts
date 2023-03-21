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

@Component({
  selector: 'app-lista-fornecedores',
  templateUrl: './lista-fornecedores.component.html',
  styleUrls: ['./lista-fornecedores.component.css'],
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
          this.listFornecedores;

          if (data) {
            this.listProdutos = data.produtos;
            this.formEsteira.get('totalPages').setValue(data.totalPaginas);
            if (data.produtos.lengh <= 0)
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
}
