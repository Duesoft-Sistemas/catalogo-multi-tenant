import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FiltroRelatorioFinanceiro } from 'src/app/shared/classes/filtro-relatorio-financeiro';
import { Formularios } from 'src/app/shared/functions/formularios';

@Component({
  selector: 'app-relatorio-financeiro-filtro',
  templateUrl: './relatorio-financeiro-filtro.component.html',
  styleUrls: ['./relatorio-financeiro-filtro.component.css']
})
export class RelatorioFinanceiroFiltroComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FiltroRelatorioFinanceiro>,
    @Inject(MAT_DIALOG_DATA) public filtro: any,
    private localeService: BsLocaleService
  ) {
    ptBrLocale.invalidDate = 'Insira uma data válida';
    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');
    this.formulario = Formularios.geraFormulario(new FiltroRelatorioFinanceiro(filtro));
  }

  ngOnInit() {
  }

  buscar(): void {
    this.dialogRef.close(new FiltroRelatorioFinanceiro(this.formulario.value));
  }

  limpar(): void {
    this.formulario = Formularios.geraFormulario(new FiltroRelatorioFinanceiro());
  }
}
