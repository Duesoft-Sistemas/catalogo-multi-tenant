import { Routes, RouterModule } from '@angular/router';
import { IniciarComponent } from './iniciar.component';

const routes: Routes = [
  { path: '', component: IniciarComponent },
];

export const IniciarRoutes = RouterModule.forChild(routes);
