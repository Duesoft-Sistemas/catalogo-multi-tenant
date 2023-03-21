import { Routes, RouterModule } from '@angular/router';
import { FornecedoresComponent } from './fornecedores.component';

const routes: Routes = [{ path: '', component: FornecedoresComponent }];

export const FornecedoresRoutes = RouterModule.forChild(routes);
