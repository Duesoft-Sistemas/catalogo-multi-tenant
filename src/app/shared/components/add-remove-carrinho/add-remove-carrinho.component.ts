import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProdutoCarrinho } from '../../classes/produto-carrinho';
import { Toaster } from '../../functions/toaster';
import { AuthStorageService } from '../../guards/auth-storage.service';

@Component({
  selector: 'app-add-remove-carrinho',
  templateUrl: './add-remove-carrinho.component.html',
  styleUrls: ['./add-remove-carrinho.component.css']
})
export class AddRemoveCarrinhoComponent implements OnInit {
  @Input() form?: FormGroup;
  @Input() controlName?: string;
  @Input() item: ProdutoCarrinho;

  @Output() novaQuantidade = new EventEmitter<number>();

  pattern =  new RegExp('/^\d+$/;');

  constructor(private storage: AuthStorageService) { }

  ngOnInit() {
    if (this.form) this.form.get(this.controlName).enable();
  }

  verificaQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if (quantidade > this.item.produto.stock) {
      Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
      this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
    } else if (quantidade < 0 || isNaN(quantidade)) {
      Toaster.Error('Quantidade inválida!');
      this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
    }
  }

  aumentaQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    let item = new ProdutoCarrinho(this.item);
    if (quantidade < this.item.produto.stock) {
      item.quantidade = quantidade + this.item.produto.unitiesOnPackage;
      this.atualizaQuantidade(item);
    } else Toaster.Warning('Quantidade maxima de estoque!');
  }


  diminuiQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    let item = new ProdutoCarrinho(this.item);
    if (quantidade > 1) {
      item.quantidade = quantidade - this.item.produto.unitiesOnPackage;
      this.atualizaQuantidade(item);
    } else Toaster.Warning('Quantidade mínima para adicionar ao carrinho!');
  }

  private atualizaQuantidade(item: ProdutoCarrinho): void {
    if (this.form) this.form.get(this.controlName).setValue(item.quantidade);
    else {
      this.novaQuantidade.emit(item.quantidade);
      this.storage.atualizaItemCarrinho(item);
    }
  }
}
