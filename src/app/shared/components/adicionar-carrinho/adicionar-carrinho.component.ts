import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProdutoCarrinho } from '../../classes/produto-carrinho';
import { Formularios } from '../../functions/formularios';
import { Toaster } from '../../functions/toaster';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { IProdutos } from '../../interface/IProdutos';
import { GlobalService } from '../../services/global.service';
import { DomSanitizer } from '@angular/platform-browser';

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
    public dialogRef: MatDialogRef<AdicionarCarrinhoComponent>,
    private sanitizer: DomSanitizer
  ) {
    this.produto = data.detalhes;
    if(this.produto.image!= "./static/img/imagem_nao_encontrada.jpg"){
      this.produto.imageSafe = this.sanitizer.bypassSecurityTrustUrl(this.produto.image)
    }
    this.formulario = Formularios.geraFormulario(new ProdutoCarrinho());
    this.formulario.get('produto').setValue(this.produto);
    this.formulario.get('quantidade').setValue(this.produto.unitiesOnPackage);

  }

  ngOnInit() {
    this.produto.unidadeEscolhida = this.produto.unity;
  }

  addCarrinho(): void {
    this.produto
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
