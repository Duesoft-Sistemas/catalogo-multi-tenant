import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcluirPedidoComponent } from './concluir-pedido.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConcluirPedidoRoutes } from './concluir-pedido.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ConcluirPedidoRoutes
  ],
  declarations: [ConcluirPedidoComponent]
})
export class ConcluirPedidoModule { }
