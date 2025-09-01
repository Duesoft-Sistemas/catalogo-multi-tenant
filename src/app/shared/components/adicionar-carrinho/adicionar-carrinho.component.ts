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
    this.produto = data;
    if (this.produto.image != './static/img/imagem_nao_encontrada.jpg') {
      this.produto.imageSafe = this.sanitizer.bypassSecurityTrustUrl(
        this.produto.image
      );
    }
    this.formulario = Formularios.geraFormulario(new ProdutoCarrinho());
    this.formulario.get('produto').setValue(this.produto);
    this.formulario
      .get('quantidade')
      .setValue(this.produto.unitiesOnPackage || 1);
  }

  ngOnInit() {
    this.produto.unidadeEscolhida = this.produto.unity;
  }

  onUnidadeChange(event: any): void {
    this.produto.unidadeEscolhida = event.target.value;
  }

  // Função para converter stock para número de forma segura
  private getStockNumber(): number {
    if (this.produto?.stock === null || this.produto?.stock === undefined) {
      return 0;
    }

    // Se for string, converter para número
    if (typeof this.produto.stock === 'string') {
      const parsed = parseFloat(this.produto.stock);
      return isNaN(parsed) ? 0 : parsed;
    }

    // Se for número, retornar diretamente
    if (typeof this.produto.stock === 'number') {
      return this.produto.stock;
    }

    // Para outros tipos, tentar converter
    const converted = Number(this.produto.stock);
    return isNaN(converted) ? 0 : converted;
  }

c  habilitaDesabilitaDiminui(): boolean {
    const quantidade = this.formulario.get('quantidade').value;
    return quantidade <= (this.produto.unitiesOnPackage || 1);
  }

  habilitaDesabilitaAumenta(): boolean {
    const quantidade = this.formulario.get('quantidade').value;
    return quantidade >= this.getStockNumber();
  }

  verificaQuantidade(): void {
    let quantidade = this.formulario.get('quantidade').value;

    if (this.produto.unidadeEscolhida == this.produto.unity2) {
      if (
        Number(quantidade) >
        Math.floor(this.getStockNumber() / this.produto.unitiesOnPackage2)
      ) {
        Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
        this.formulario.get('quantidade').setValue(1);
      } else if (
        Number(quantidade) % 1 != 0 ||
        Number(quantidade) < 0 ||
        isNaN(quantidade)
      ) {
        Toaster.Error('Quantidade inválida!');
        this.formulario.get('quantidade').setValue(1);
      }
    } else {
      if (Number(quantidade) > this.getStockNumber()) {
        Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
        this.formulario.get('quantidade').setValue(1);
      } else if (
        Number(quantidade) % 1 != 0 ||
        Number(quantidade) < 0 ||
        isNaN(quantidade)
      ) {
        Toaster.Error('Quantidade inválida!');
        this.formulario.get('quantidade').setValue(1);
      }
    }
  }

  aumentaQuantidade(): void {
    let quantidade = this.formulario.get('quantidade').value;
    if (
      Number(quantidade) % 1 != 0 ||
      Number(quantidade) < 0 ||
      isNaN(quantidade)
    ) {
      Toaster.Error('Quantidade inválida!');
      this.formulario.get('quantidade').setValue(1);
    } else {
      if (this.produto.unidadeEscolhida == this.produto.unity2) {
        if (
          Number(quantidade) <
          Math.floor(this.getStockNumber() / this.produto.unitiesOnPackage2)
        ) {
          this.formulario
            .get('quantidade')
            .setValue(
              Number(quantidade) + (this.produto.unitiesOnPackage || 1)
            );
        } else {
          Toaster.Warning('Quantidade maxima de estoque!');
        }
      } else {
        if (Number(quantidade) < this.getStockNumber()) {
          this.formulario
            .get('quantidade')
            .setValue(
              Number(quantidade) + (this.produto.unitiesOnPackage || 1)
            );
        } else {
          Toaster.Warning('Quantidade maxima de estoque!');
        }
      }
    }
  }

  diminuiQuantidade(): void {
    let quantidade = this.formulario.get('quantidade').value;
    if (
      Number(quantidade) % 1 != 0 ||
      Number(quantidade) < 0 ||
      isNaN(quantidade)
    ) {
      Toaster.Error('Quantidade inválida!');
      this.formulario.get('quantidade').setValue(1);
    } else {
      if (Number(quantidade) > 1) {
        this.formulario
          .get('quantidade')
          .setValue(Number(quantidade) - (this.produto.unitiesOnPackage || 1));
      } else {
        Toaster.Warning('Quantidade mínima para adicionar ao carrinho!');
      }
    }
  }

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
      ) {
        Toaster.Warning(
          'Não é possivel adicionar quantidade ao carrinho, pois irá ultrapassar estoque disponível!'
        );
      } else {
        this.storage.addProdutoCarrinho(this.formulario.getRawValue());
        Toaster.Success('Produto adicionado ao carrinho!');
        this.dialogRef.close(true);
      }
    } else {
      Toaster.Error('Ocorreu um erro ao adicionar produto no carrinho!');
    }
  }

  convertToNumber(value: any): number {
    if (!value) return 0;
    const stringValue = value.toString();
    return +stringValue.replace(',', '.');
  }
}
