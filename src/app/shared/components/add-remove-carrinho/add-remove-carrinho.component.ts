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
  utilizaUnidade2 = false;
  habilitaDesabilita = false;
  listUnidade = [];

  pattern =  new RegExp('/^\d+$/;');

  constructor(private storage: AuthStorageService) { }

  ngOnInit() {
    if (this.form)
      this.form.get(this.controlName).enable();
    if(this.item.produto.unity2!=null && this.item.produto.unity2!=''){
      this.habilitaDesabilita = true;
      this.listUnidade.push(this.item.produto.unity);
      this.listUnidade.push(this.item.produto.unity2);
    }
  }

  habilitarForm(unidade:any):void{
    this.habilitaDesabilita = false;
    this.item.produto.unidadeEscolhida = unidade;
    if(this.item.produto.unity2 == unidade){
      this.utilizaUnidade2 = true;
    }else
    {
      this.utilizaUnidade2 = false;
      this.item.quantidade = Number(this.item.produto.unitiesOnPackage);
    }
    this.form.get(this.controlName).setValue(this.item.quantidade);
    this.verificaQuantidade();
  }

  habilitar(unidade:any):void{
    this.habilitaDesabilita = false;
    this.item.produto.unidadeEscolhida = unidade;
    if(this.item.produto.unity2 == unidade){
      this.utilizaUnidade2 = true;
    }else
    {
      this.utilizaUnidade2 = false;
      this.item.quantidade = Number(this.item.produto.unitiesOnPackage);
    }
    this.verificaQuantidade();
  }

  habilitaDesabilitaDiminuiForm(controlName:any): any{
    //form.get(controlName).value <= item.produto.unitiesOnPackage || this.habilitaDesabilita
      if(this.form.get(controlName).value <= this.item.produto.unitiesOnPackage || this.habilitaDesabilita)
        return true;
      else
        return false;
  }

  habilitaDesabilitaAumentaForm(controlName:any): any{
    //form.get(controlName).value <= item.produto.unitiesOnPackage || this.habilitaDesabilita
      if(this.form.get(controlName).value === this.item.produto.stock || this.habilitaDesabilita)
        return true;
      else
        return false;
  }

  habilitaDesabilitaDiminui(): any{
    //form.get(controlName).value <= item.produto.unitiesOnPackage || this.habilitaDesabilita

      if(this.item.quantidade <= this.item.produto.unitiesOnPackage)
        return true;
      else
        return false;
  }

  habilitaDesabilitaAumenta(): any{
    //form.get(controlName).value <= item.produto.unitiesOnPackage || this.habilitaDesabilita
      if(this.item.quantidade === this.item.produto.stock)
        return true;
      else
        return false;
  }

  verificaQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if(this.item.produto.unidadeEscolhida == this.item.produto.unity2){
      if (Number(quantidade) > (Math.floor(this.item.produto.stock/this.item.produto.unitiesOnPackage2))) {
        Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      } else if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
        Toaster.Error('Quantidade inválida!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      }else
        this.atualizaQuantidade(this.item);
    }else{
      if (Number(quantidade) > this.item.produto.stock) {
        Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      } else if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
        Toaster.Error('Quantidade inválida!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      }else
        this.atualizaQuantidade(this.item);
    }
  }

  aumentaQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
      Toaster.Error('Quantidade inválida!');
      this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
    }else{
      let item = new ProdutoCarrinho(this.item);
      if(this.item.produto.unidadeEscolhida == this.item.produto.unity2){
        if (Number(quantidade) < (Math.floor(this.item.produto.stock/this.item.produto.unitiesOnPackage2))) {
          item.quantidade = Number(quantidade) + this.item.produto.unitiesOnPackage;
        this.atualizaQuantidade(item);
        }else Toaster.Warning('Quantidade maxima de estoque!');
      }else
      if (Number(quantidade) < this.item.produto.stock) {
          item.quantidade = Number(quantidade) + this.item.produto.unitiesOnPackage;
        this.atualizaQuantidade(item);
      } else Toaster.Warning('Quantidade maxima de estoque!');
    }
  }

  diminuiQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
      Toaster.Error('Quantidade inválida!');
      this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
    }else{
      let item = new ProdutoCarrinho(this.item);
      if (Number(quantidade) > 1) {
          item.quantidade = Number(quantidade) - this.item.produto.unitiesOnPackage;
        this.atualizaQuantidade(item);
      } else Toaster.Warning('Quantidade mínima para adicionar ao carrinho!');
    }
  }

  private atualizaQuantidade(item: ProdutoCarrinho): void {
    if (this.form) this.form.get(this.controlName).setValue(item.quantidade);
    else {
      this.novaQuantidade.emit(item.quantidade);
      this.storage.atualizaItemCarrinho(item);
    }
  }
}
