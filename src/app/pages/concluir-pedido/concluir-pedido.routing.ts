import { Routes, RouterModule } from '@angular/router';
import { ConcluirPedidoComponent } from './concluir-pedido.component';

const routes: Routes = [{ path: '', component: ConcluirPedidoComponent }];

export const ConcluirPedidoRoutes = RouterModule.forChild(routes);
