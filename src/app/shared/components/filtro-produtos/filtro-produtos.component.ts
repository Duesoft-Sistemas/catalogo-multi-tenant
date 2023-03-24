import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FiltroPesquisarProdutos } from '../../classes/filtro-pesquisar-produtos';
import { SeletorImagemCatalogo } from '../../classes/seletor-imagem-catalogo';
import { KeyboardKey } from '../../enums/keyboard-key.enum';
import { Formularios } from '../../functions/formularios';
import { Tenant, TenantService } from '../../tenant/tenant.service';

@Component({
  selector: 'app-filtro-produtos',
  templateUrl: './filtro-produtos.component.html',
  styleUrls: ['./filtro-produtos.component.css', './filtro-produtos.component.skins.less'],
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

  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;
  @HostBinding("class.autocar") public client3Theme: boolean;
  @HostBinding("class.microtec") public client4Theme: boolean;
  @HostBinding("class.mm") public client5Theme: boolean;
  @HostBinding("class.prudenseg") public client6Theme: boolean;
  @HostBinding("class.diskagua") public client7Theme: boolean;
  formulario: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FiltroProdutosComponent>,
    private serviceTenant : TenantService) {
      this.formulario = Formularios.geraFormulario(new FiltroPesquisarProdutos());
  }

  ngOnInit() {
    this.habilitaTema();
  }

  buscar(): void {
    this.formulario.value.code = this.formulario.value.code?.trim() ?? '';
    this.formulario.value.code = this.formulario.value.code.toUpperCase();
    this.dialogRef.close(new FiltroPesquisarProdutos(this.formulario.value));
  }

  limpar(): void {
    this.formulario = Formularios.geraFormulario(new FiltroPesquisarProdutos());
  }

  habilitaTema(){
    this.client1Theme = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.client2Theme = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.client3Theme = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.client4Theme = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.client5Theme = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.client6Theme = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.client7Theme = this.serviceTenant.getTenant() === Tenant.catalogolm;
  }
}
