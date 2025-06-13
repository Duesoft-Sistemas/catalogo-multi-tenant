import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { AlterarSenha } from 'src/app/shared/classes/alterar-senha';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css'],
})
export class AlterarSenhaComponent implements OnInit {
  formulario: FormGroup;
  spinner = false;

  constructor(
    private service: GlobalService,
    public dialogRef: MatDialogRef<AlterarSenhaComponent>
  ) {
    this.formulario = Formularios.geraFormulario(new AlterarSenha());
  }

  ngOnInit() {}

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
}
