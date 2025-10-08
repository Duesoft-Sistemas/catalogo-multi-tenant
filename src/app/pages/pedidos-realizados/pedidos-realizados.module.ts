import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosRealizadosComponent } from './pedidos-realizados.component';
import { PedidosRealizadosDetalhesComponent } from './pedidos-realizados-detalhes/pedidos-realizados-detalhes.component';
import { PedidosRealizadosFiltroComponent } from './pedidos-realizados-filtro/pedidos-realizados-filtro.component';
import { PedidosRealizadosRoutes } from './pedidos-realizados.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, CommonModule, PedidosRealizadosRoutes],
  declarations: [
    PedidosRealizadosComponent,
    PedidosRealizadosDetalhesComponent,
    PedidosRealizadosFiltroComponent,
  ],
})
export class PedidosRealizadosModule {}
