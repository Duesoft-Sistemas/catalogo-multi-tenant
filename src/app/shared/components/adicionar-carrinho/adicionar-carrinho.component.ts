import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProdutoCarrinho } from '../../classes/produto-carrinho';
import { Formularios } from '../../functions/formularios';
import { Toaster } from '../../functions/toaster';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { IProdutos } from '../../interface/IProdutos';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-adicionar-carrinho',
  templateUrl: './adicionar-carrinho.component.html',
  styleUrls: ['./adicionar-carrinho.component.css'],
})
export class AdicionarCarrinhoComponent implements OnInit {
  imgPadraoProduto = '../../../assets/images/imagem_nao_encontrada.jpg';

  produto!: IProdutos;
  formulario: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: GlobalService,
    private storage: AuthStorageService,
    public dialogRef: MatDialogRef<AdicionarCarrinhoComponent>
  ) {
    this.produto = data.detalhes;
    this.formulario = Formularios.geraFormulario(new ProdutoCarrinho());
    this.formulario.get('produto').setValue(this.produto);
    this.formulario.get('quantidade').setValue(this.produto.unitiesOnPackage);
  }

  ngOnInit() {}

  // getDetalhes(): void {
  //   this.service
  //     .getDetalhesProduto(this.data.produto.id)
  //     .pipe(take(1))
  //     .subscribe(
  //       (data) => {
  //         if (data) this.produto = data;
  //         else Toaster.Warning('Produto não encontrado.');
  //       },
  //       () => { Toaster.Error('Ocorreu um erro ao pesquisar os detalhes do produto selecionado.'); }
  //     );
  // }

  addCarrinho(): void {
    if (this.formulario.valid) {
      let quantidade = this.formulario.get('quantidade').value;
      let carrinho = this.storage.getCarrinho();
      let index = carrinho.findIndex(
        (x) => x.produto.code === this.produto.code
      );
      if (
        index >= 0 &&
        quantidade + carrinho[index].quantidade > this.produto.stock
      )
        Toaster.Warning(
          'Não é possivel adicionar quantidade ao carrinho, pois irá ultrapassar estoque disponível!'
        );
      else {
        this.storage.addProdutoCarrinho(this.formulario.getRawValue());
        Toaster.Success('Produto adicionado ao carrinho!');
        this.dialogRef.close();
      }
    } else {
      Toaster.Error('Ocorreu um erro ao adicionar produto no carrinho!');
    }
  }

  convertToNumber(value: any): number {
    return +value.toString().replace(',', '.');
  }
}
