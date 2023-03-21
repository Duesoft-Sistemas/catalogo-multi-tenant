import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { BodyPageComponent } from './components/bodies/body-page/body-page.component';
import { InputModelComponent } from './components/inputs/input-model/input-model.component';
import { TableModelComponent } from './components/table-model/table-model.component';
import { FiltroProdutosComponent } from './components/filtro-produtos/filtro-produtos.component';
import { DetalhesProdutosComponent } from './components/detalhes-produtos/detalhes-produtos.component';
import { ListaProdutosComponent } from './components/lista-produtos/lista-produtos.component';
import { AdicionarCarrinhoComponent } from './components/adicionar-carrinho/adicionar-carrinho.component';
import { AddRemoveCarrinhoComponent } from './components/add-remove-carrinho/add-remove-carrinho.component';
import { BodyModalComponent } from './components/bodies/body-modal/body-modal.component';
import { PessoasCrudFormComponent } from './components/pessoas-crud-form/pessoas-crud-form.component';
import { SelectModelComponent } from './components/inputs/select-model/select-model.component';
import { CheckboxModelComponent } from './components/inputs/checkbox-model/checkbox-model.component';
import { BtnCancelarComponent } from './components/buttons/btn-cancelar/btn-cancelar.component';
import { BtnSalvarComponent } from './components/buttons/btn-salvar/btn-salvar.component';
import { ListaFornecedoresComponent } from './components/lista-fornecedores/lista-fornecedores.component';
import { FormDebugComponent } from './components/assistants/form-debug/form-debug.component';
import { CarroselImagensIniciarComponent } from './components/carrosel-imagens-iniciar/carrosel-imagens-iniciar.component';

registerLocaleData(localePt);

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: 0,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    NgxMaskModule.forRoot(maskConfigFunction),
    MatCardModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    PaginationModule.forRoot(),
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatDividerModule,
    CarouselModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    ModalConfirmComponent,
    SpinnerComponent,
    PessoasCrudFormComponent,
    BodyPageComponent,
    BodyModalComponent,
    SelectModelComponent,
    InputModelComponent,
    CheckboxModelComponent,
    BtnCancelarComponent,
    BtnSalvarComponent,
    TableModelComponent,
    FiltroProdutosComponent,
    DetalhesProdutosComponent,
    ListaProdutosComponent,
    ListaFornecedoresComponent,
    AdicionarCarrinhoComponent,
    AddRemoveCarrinhoComponent,
    FormDebugComponent,
    CarroselImagensIniciarComponent,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    NgxMaskModule,
    PaginationModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CarouselModule,
    MatTableModule,
    MatPaginatorModule,
    BsDatepickerModule,
    //components
    SpinnerComponent,
    ModalConfirmComponent,
    PessoasCrudFormComponent,
    BodyPageComponent,
    BodyModalComponent,
    SelectModelComponent,
    InputModelComponent,
    CheckboxModelComponent,
    BtnCancelarComponent,
    BtnSalvarComponent,
    TableModelComponent,
    FiltroProdutosComponent,
    DetalhesProdutosComponent,
    ListaProdutosComponent,
    ListaFornecedoresComponent,
    AdicionarCarrinhoComponent,
    AddRemoveCarrinhoComponent,
    FormDebugComponent,
    CarroselImagensIniciarComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }
  ],
})
export class SharedModule {}
