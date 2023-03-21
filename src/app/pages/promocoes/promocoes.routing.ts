import { Routes, RouterModule } from '@angular/router';
import { PromocoesComponent } from './promocoes.component';

const routes: Routes = [{ path: '', component: PromocoesComponent }];

export const PromocoesRoutes = RouterModule.forChild(routes);
