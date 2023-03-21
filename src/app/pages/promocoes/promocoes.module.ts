import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocoesComponent } from './promocoes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PromocoesRoutes } from './promocoes.routing';

@NgModule({
  imports: [CommonModule, SharedModule, PromocoesRoutes],
  declarations: [PromocoesComponent],
})
export class PromocoesModule {}
