import { Validators } from "@angular/forms";
import { IFormularios } from "../interface/IFormularios";
import { IProdutos } from "../interface/IProdutos";

export class ProdutoCarrinho implements IFormularios {
  produto: IProdutos;
  quantidade: number;
  observacao: string;

  constructor(values?: any) {
    this.produto = values ? values.produto : null;
    this.quantidade = values ? values.quantidade : 1;
    this.observacao = values ? values.observacao : null;
  }

  getValidators(): any[] {
    return [
      ['produto', [Validators.required]],
      ['quantidade', [Validators.required, Validators.min(1)]],
      ['itens', [Validators.required]]
    ];
  }

  getItem(): any {
    return {
      id: this.produto.id,
      image: this.produto.image,
      code: this.produto.code,
      productGroup: this.produto.productGroup,
      description: this.produto.description,
      qtd: 0.000000,
      appQtd: this.quantidade,
      unity: this.produto.unidadeEscolhida,
      price: 0.00,
      appPrice: this.produto.unidadeEscolhida === this.produto.unity2 ? +Number(this.produto.price2.toString().replace(',', '.')) : +this.produto.price.toString().replace(',', '.'),
      totalPrice: 0.00,
      appTotalPrice: this.produto.unidadeEscolhida === this.produto.unity2 ? (this.quantidade* +this.produto.price2.toString().replace(',', '.')) : (this.quantidade * +this.produto.price.toString().replace(',', '.')),
    };
  }
}
