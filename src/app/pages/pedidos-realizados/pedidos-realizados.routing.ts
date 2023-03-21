import { Routes, RouterModule } from '@angular/router';
import { PedidosRealizadosComponent } from './pedidos-realizados.component';

const routes: Routes = [{ path: '', component: PedidosRealizadosComponent }];

export const PedidosRealizadosRoutes = RouterModule.forChild(routes);
