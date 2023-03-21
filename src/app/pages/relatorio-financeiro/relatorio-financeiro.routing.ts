import { Routes, RouterModule } from '@angular/router';
import { RelatorioFinanceiroComponent } from './relatorio-financeiro.component';

const routes: Routes = [{ path: '', component: RelatorioFinanceiroComponent }];

export const RelatorioFinanceiroRoutes = RouterModule.forChild(routes);
