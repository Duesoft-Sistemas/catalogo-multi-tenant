import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FiltroPesquisarProdutos } from '../../classes/filtro-pesquisar-produtos';
import { KeyboardKey } from '../../enums/keyboard-key.enum';
import { Formularios } from '../../functions/formularios';

@Component({
  selector: 'app-filtro-produtos',
  templateUrl: './filtro-produtos.component.html',
  styleUrls: ['./filtro-produtos.component.css'],
})
export class FiltroProdutosComponent implements OnInit {
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: any) {
    if (
      event.code === KeyboardKey.Enter ||
      event.code === KeyboardKey.EnterNumpad
    ) {
      if (event.target.id === 'inputFiltrar') this.buscar();
      // else this.pesquisarProdutos();
    }
  }

  formulario: FormGroup;

  constructor(public dialogRef: MatDialogRef<FiltroProdutosComponent>) {
    this.formulario = Formularios.geraFormulario(new FiltroPesquisarProdutos());
  }

  ngOnInit() {}

  buscar(): void {
    this.formulario.value.code = this.formulario.value.code?.trim() ?? '';
    this.formulario.value.code = this.formulario.value.code.toUpperCase();
    this.dialogRef.close(new FiltroPesquisarProdutos(this.formulario.value));
  }

  limpar(): void {
    this.formulario = Formularios.geraFormulario(new FiltroPesquisarProdutos());
  }
}
