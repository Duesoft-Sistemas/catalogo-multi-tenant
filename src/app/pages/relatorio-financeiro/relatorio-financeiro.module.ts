import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatorioFinanceiroComponent } from './relatorio-financeiro.component';
import { RelatorioFinanceiroFiltroComponent } from './relatorio-financeiro-filtro/relatorio-financeiro-filtro.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RelatorioFinanceiroRoutes } from './relatorio-financeiro.routing';

@NgModule({
  imports: [CommonModule, SharedModule, RelatorioFinanceiroRoutes],
  declarations: [
    RelatorioFinanceiroComponent,
    RelatorioFinanceiroFiltroComponent,
  ],
})
export class RelatorioFinanceiroModule {}
