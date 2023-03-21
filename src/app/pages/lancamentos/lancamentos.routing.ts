import { Routes, RouterModule } from '@angular/router';
import { LancamentosComponent } from './lancamentos.component';

const routes: Routes = [{ path: '', component: LancamentosComponent }];

export const LancamentosRoutes = RouterModule.forChild(routes);
