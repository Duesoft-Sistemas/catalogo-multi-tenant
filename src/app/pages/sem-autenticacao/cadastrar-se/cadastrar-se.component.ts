import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { Pessoas } from '../../pessoas/pessoas';
import { GlobalService } from 'src/app/shared/services/global.service';
import { take } from 'rxjs';
import { cnpj, cpf } from 'cpf-cnpj-validator';

@Component({
  selector: 'app-cadastrar-se',
  templateUrl: './cadastrar-se.component.html',
  styleUrls: ['./cadastrar-se.component.css'],
})
export class CadastrarSeComponent implements OnInit {
  form!: FormGroup;
  spinner = true;
  formularios = Formularios;
  listEmpresas = [];
  loadListEmpresas = true;

  constructor(
    public dialogRef: MatDialogRef<CadastrarSeComponent>,
    @Inject(MAT_DIALOG_DATA) public codigo: any,
    private service: GlobalService,
  ) {
    this.spinner = false;
    this.form = Formularios.geraFormulario(new Pessoas());
    this.getAllCompanies();
  }

  ngOnInit(): void {}

  // Métodos auxiliares para validação
  isFieldValid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? this.formularios.validTouched(control as FormControl) : false;
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    return control ? this.formularios.msgErroCustom(control as FormControl) : '';
  }

  getAllCompanies(): void {
    this.spinner = true;
    this.loadListEmpresas = true;
    this.service
      .getAllCompanies()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) this.listEmpresas = data;
        },
        error: () => {
          Toaster.Error('Não há empresas cadastradas!');
          this.spinner = false;
          this.loadListEmpresas = false;
        },
        complete: () => {
          this.spinner = false;
          this.loadListEmpresas = false;
        },
      });
  }

  verificaCnpj(): void {
    let formCnpj = this.form.get('cpfCnpj');
    if (formCnpj?.touched && formCnpj?.dirty) {
      if (!cnpj.isValid(formCnpj.value)) {
        this.form.get('cpfCnpj')?.setErrors({ cnpj: true });
      } else {
        this.form.get('cpfCnpj')?.setErrors(null);
      }
    }
  }

  verificaCpf(): void {
    let formCpf = this.form.get('cpfCnpj');
    if (formCpf?.touched && formCpf?.dirty) {
      if (!cpf.isValid(formCpf.value)) {
        this.form.get('cpfCnpj')?.setErrors({ cpf: true });
      } else {
        this.form.get('cpfCnpj')?.setErrors(null);
      }
    }
  }

  salvar(): void {
    this.spinner = true;
    if (this.form.valid) {
      this.service
        .cadastrarUsuario(this.form.value)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            this.dialogRef.close();
            Toaster.Success(Toaster.msg.RegistroSalvo);
          },
          error: (error) => {
            this.spinner = false;
            Toaster.Error(error.error);
          },
          complete: () => {
            this.spinner = false;
          },
        });
    } else {
      this.spinner = false;
      this.form.markAllAsTouched();
      Toaster.Warning(Toaster.msg.FormularioInvalido);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
