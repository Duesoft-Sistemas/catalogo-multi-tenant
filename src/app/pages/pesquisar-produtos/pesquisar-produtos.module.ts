import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PesquisarProdutosComponent } from './pesquisar-produtos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PesquisarProdutosRoutes } from './pesquisar-produtos.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PesquisarProdutosRoutes,
  ],
  declarations: [PesquisarProdutosComponent]
})
export class PesquisarProdutosModule { }
