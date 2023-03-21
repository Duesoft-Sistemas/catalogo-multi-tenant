import { NgModule } from '@angular/core';
import { IniciarComponent } from './iniciar.component';
import { IniciarRoutes } from './iniciar.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ModalPesquisaAvancadaComponent } from './modal-pesquisa-avancada/modal-pesquisa-avancada.component';

@NgModule({
  imports: [
    IniciarRoutes,
    SharedModule,
    MatIconModule,
  ],
  declarations: [IniciarComponent, ModalPesquisaAvancadaComponent]
})
export class IniciarModule { }
