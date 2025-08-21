import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public routes (no authentication required)
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },

  // Protected routes (authentication required)
  {
    path: 'inicio',
    loadChildren: () => import('./pages/iniciar/iniciar.module').then(m => m.IniciarModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'lancamentos',
    loadChildren: () => import('./pages/lancamentos/lancamentos.module').then(m => m.LancamentosModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'promocoes',
    loadChildren: () => import('./pages/promocoes/promocoes.module').then(m => m.PromocoesModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'fornecedores',
    loadChildren: () => import('./pages/fornecedores/fornecedores.module').then(m => m.FornecedoresModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'pesquisar-produtos',
    loadChildren: () => import('./pages/pesquisar-produtos/pesquisar-produtos.module').then(m => m.PesquisarProdutosModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'pedidos-realizados',
    loadChildren: () => import('./pages/pedidos-realizados/pedidos-realizados.module').then(m => m.PedidosRealizadosModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'concluir-pedido',
    loadChildren: () => import('./pages/concluir-pedido/concluir-pedido.module').then(m => m.ConcluirPedidoModule),
    canActivate: [AuthGuardService],
  },

  // NotFound
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
