import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IniciarComponent } from './iniciar.component';
import { IniciarRoutes } from './iniciar.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ModalPesquisaAvancadaComponent } from './modal-pesquisa-avancada/modal-pesquisa-avancada.component';

@NgModule({
  imports: [
    IniciarRoutes,
    SharedModule,
    FormsModule,
    MatIconModule,
  ],
  declarations: [IniciarComponent, ModalPesquisaAvancadaComponent],
  exports: [IniciarComponent]
})
export class IniciarModule { }
