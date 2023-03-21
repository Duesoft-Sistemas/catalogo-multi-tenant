import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevolucoesComponent } from './devolucoes.component';
import { DevolucoesRoutes } from './devolucoes.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DevolucoesRoutes,
  ],
  declarations: [DevolucoesComponent]
})
export class DevolucoesModule { }
