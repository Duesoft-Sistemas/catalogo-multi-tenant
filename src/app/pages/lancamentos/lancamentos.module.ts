import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LancamentosComponent } from './lancamentos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LancamentosRoutes } from './lancamentos.routing';

@NgModule({
  imports: [CommonModule, SharedModule, LancamentosRoutes],
  declarations: [LancamentosComponent],
})
export class LancamentosModule {}
