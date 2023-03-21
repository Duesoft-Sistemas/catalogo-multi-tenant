import { Routes, RouterModule } from '@angular/router';
import { DevolucoesComponent } from './devolucoes.component';

const routes: Routes = [
  { path: '', component: DevolucoesComponent },
];

export const DevolucoesRoutes = RouterModule.forChild(routes);
