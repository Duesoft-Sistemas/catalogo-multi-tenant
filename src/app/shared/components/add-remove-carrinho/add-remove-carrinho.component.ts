import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { ProdutoCarrinho } from '../../classes/produto-carrinho';
import { Toaster } from '../../functions/toaster';

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
    this.listUnidade = [
      { value: this.item.produto.unity, label: this.item.produto.unity }
    ];
    
    if (this.item.produto.unity2) {
      this.listUnidade.push({ value: this.item.produto.unity2, label: this.item.produto.unity2 });
    }
    
    this.item.produto.unidadeEscolhida = this.item.produto.unity;
    this.habilitarForm(this.item.produto.unity);
    this.habilitar(this.item.produto.unity);
  }

  // Função para converter stock para número de forma segura
  private getStockNumber(): number {
    if (this.item?.produto?.stock === null || this.item?.produto?.stock === undefined) {
      return 0;
    }
    
    // Se for string, converter para número
    if (typeof this.item.produto.stock === 'string') {
      const parsed = parseFloat(this.item.produto.stock);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // Se for número, retornar diretamente
    if (typeof this.item.produto.stock === 'number') {
      return this.item.produto.stock;
    }
    
    // Para outros tipos, tentar converter
    const converted = Number(this.item.produto.stock);
    return isNaN(converted) ? 0 : converted;
  }

  habilitarForm(unidade:any):void{
    if(unidade == this.item.produto.unity2){
      this.utilizaUnidade2 = true;
      this.habilitaDesabilita = false;
    } else {
      this.utilizaUnidade2 = false;
      this.habilitaDesabilita = false;
    }
  }

  habilitar(unidade:any):void{
    if(unidade == this.item.produto.unity2){
      this.utilizaUnidade2 = true;
      this.habilitaDesabilita = false;
    } else {
      this.utilizaUnidade2 = false;
      this.habilitaDesabilita = false;
    }
  }

  habilitaDesabilitaDiminuiForm(controlName:any): any{
    if (!this.form || !controlName) return true;
    const value = this.form.get(controlName).value;
    return value <= this.item.produto.unitiesOnPackage || this.habilitaDesabilita;
  }

  habilitaDesabilitaAumentaForm(controlName:any): any{
    if (!this.form || !controlName) return true;
    const value = this.form.get(controlName).value;
    return value === this.getStockNumber() || this.habilitaDesabilita;
  }

  habilitaDesabilitaDiminui(): any{
    return this.item.quantidade <= this.item.produto.unitiesOnPackage;
  }

  habilitaDesabilitaAumenta(): any{
    return this.item.quantidade === this.getStockNumber();
  }

  verificaQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if(this.item.produto.unidadeEscolhida == this.item.produto.unity2){
      if (Number(quantidade) > (Math.floor(this.getStockNumber()/this.item.produto.unitiesOnPackage2))) {
        Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      } else if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
        Toaster.Error('Quantidade inválida!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      } else {
        this.atualizaQuantidade(this.item);
      }
    } else {
      if (Number(quantidade) > this.getStockNumber()) {
        Toaster.Error('Quantidade acima da quantidade de estoque disponível!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      } else if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
        Toaster.Error('Quantidade inválida!');
        this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
      } else {
        this.atualizaQuantidade(this.item);
      }
    }
  }

  aumentaQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
      Toaster.Error('Quantidade inválida!');
      this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
    } else {
      let item = new ProdutoCarrinho(this.item);
      if(this.item.produto.unidadeEscolhida == this.item.produto.unity2){
        if (Number(quantidade) < (Math.floor(this.getStockNumber()/this.item.produto.unitiesOnPackage2))) {
          item.quantidade = Number(quantidade) + this.item.produto.unitiesOnPackage;
          this.atualizaQuantidade(item);
        } else {
          Toaster.Warning('Quantidade maxima de estoque!');
        }
      } else {
        if (Number(quantidade) < this.getStockNumber()) {
          item.quantidade = Number(quantidade) + this.item.produto.unitiesOnPackage;
          this.atualizaQuantidade(item);
        } else {
          Toaster.Warning('Quantidade maxima de estoque!');
        }
      }
    }
  }

  diminuiQuantidade(): void {
    let quantidade = this.form ? this.form.get(this.controlName).value : this.item.quantidade;
    if (Number(quantidade)%1 !=0 || Number(quantidade) < 0 || isNaN(quantidade)) {
      Toaster.Error('Quantidade inválida!');
      this.form ? this.form.get(this.controlName).setValue(1) : this.item.quantidade = 1;
    } else {
      let item = new ProdutoCarrinho(this.item);
      if (Number(quantidade) > 1) {
        item.quantidade = Number(quantidade) - this.item.produto.unitiesOnPackage;
        this.atualizaQuantidade(item);
      } else {
        Toaster.Warning('Quantidade mínima para adicionar ao carrinho!');
      }
    }
  }

  private atualizaQuantidade(item: ProdutoCarrinho): void {
    if (this.form && this.controlName) {
      this.form.get(this.controlName).setValue(item.quantidade);
    } else {
      this.novaQuantidade.emit(item.quantidade);
      this.storage.atualizaItemCarrinho(item);
    }
  }
}
