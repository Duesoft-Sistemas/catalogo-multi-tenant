import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { AlterarSenha } from 'src/app/shared/classes/alterar-senha';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Tenant, TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css', './alterar-senha.component.skins.less'],
})
export class AlterarSenhaComponent implements OnInit {
  formulario: FormGroup;
  spinner = false;
  @HostBinding("class.mendes") public client1Theme: boolean;
  @HostBinding("class.canguru") public client2Theme: boolean;
  @HostBinding("class.autocar") public client3Theme: boolean;
  @HostBinding("class.microtec") public client4Theme: boolean;
  @HostBinding("class.mm") public client5Theme: boolean;
  @HostBinding("class.prudenseg") public client6Theme: boolean;
  @HostBinding("class.diskagua") public client7Theme: boolean;

  constructor(
    private service: GlobalService,
    public dialogRef: MatDialogRef<AlterarSenhaComponent>,
    private serviceTenant: TenantService
  ) {
    this.formulario = Formularios.geraFormulario(new AlterarSenha());
  }

  ngOnInit() {
    this.habilitaTema();
  }

  validaErrorSenhas(aux: any): boolean {
    return Formularios.validTouched(this.formulario.get(aux) as FormControl);
  }

  alterar(): void {
    this.spinner = true;
    if (this.formulario.valid) {
      this.service
        .alterarSenha(this.formulario.value)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.dialogRef.close();
            Toaster.Success('Senha alterada com sucesso!');
          },
          error: () => {
            this.spinner = false;
            Toaster.Error('Não foi possível alterar sua senha. Entre em contato com a loja!');
          },
          complete: () => { this.spinner = false; }
        });
    } else {
      this.spinner = false;
      this.formulario.markAllAsTouched();
      Toaster.Warning(Toaster.msg.FormularioInvalido);
    }
  }

  verificaSenhasIguais(): void {
    const senha = this.formulario.get('newPassword')?.value;
    const confirmarSenha = this.formulario.get('confirmNewPassword')?.value;

    if ((senha && confirmarSenha) && (senha !== confirmarSenha)) {
      this.formulario.get('newPassword')?.setErrors({ senhasDiferentes: true });
      this.formulario.get('confirmNewPassword')?.setErrors({ senhasDiferentes: true });
    } else {
      this.formulario.get('newPassword')?.setErrors(null);
      this.formulario.get('confirmNewPassword')?.setErrors(null);
    }
    this.formulario.updateValueAndValidity();
  }

  private habilitaTema() {
    this.client1Theme = this.serviceTenant.getTenant() === Tenant.catalogomendes;
    this.client2Theme = this.serviceTenant.getTenant() === Tenant.catalogomaster;
    this.client3Theme = this.serviceTenant.getTenant() === Tenant.catalogoautocar;
    this.client4Theme = this.serviceTenant.getTenant() === Tenant.catalogomicrotec;
    this.client5Theme = this.serviceTenant.getTenant() === Tenant.catalogomm;
    this.client6Theme = this.serviceTenant.getTenant() === Tenant.catalogoprudenseg;
    this.client7Theme = this.serviceTenant.getTenant() === Tenant.catalogolm;
  }
}
