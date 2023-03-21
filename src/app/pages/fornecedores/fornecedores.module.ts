import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedoresComponent } from './fornecedores.component';
import { FornecedoresRoutes } from './fornecedores.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FornecedoresRoutes
  ],
  declarations: [FornecedoresComponent]
})
export class FornecedoresModule { }
