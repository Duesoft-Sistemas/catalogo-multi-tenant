import { Routes, RouterModule } from '@angular/router';
import { PesquisarProdutosComponent } from './pesquisar-produtos.component';

const routes: Routes = [
  { path: '', component: PesquisarProdutosComponent },
];

export const PesquisarProdutosRoutes = RouterModule.forChild(routes);
