import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { RecuperarSenha } from 'src/app/shared/classes/recuperar-senha';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { GlobalService } from 'src/app/shared/services/global.service';
import { TenantService } from 'src/app/shared/tenant/tenant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css'],
})
export class RecuperarSenhaComponent implements OnInit {
  formulario: FormGroup;
  spinner = false;
  listEmpresas = [];
  cnpjValido = false;
  modelo: RecuperarSenha = new RecuperarSenha();
  mostrarEmail = '';

  constructor(
    private service: GlobalService,
    private serviceTenant : TenantService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RecuperarSenhaComponent>
  ) {
    this.spinner = true;
    this.service
      .getEmail(data.modelo.cnpj)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          // Verificar se a resposta contém um email válido
          let email: string = '';
          
          if (typeof response === 'string') {
            email = response;
          } else if (response && typeof response === 'object') {
            // Tentar diferentes propriedades que podem conter o email
            email = response.email || response.Email || response.data || response.value || '';
          }
          
          if (email && typeof email === 'string' && email.trim() !== '') {
            this.cnpjValido = true; // Email encontrado, marcar como válido
            data.modelo.email = email;
            
            // Mascarar o email para exibição
            var divide = email.split('');
            divide.forEach((letra, index) => {
              if (index === 0 || index > 3) {
                this.mostrarEmail += letra;
              } else {
                this.mostrarEmail += '*';
              }
            });
            
            this.formulario = Formularios.geraFormulario(
              new RecuperarSenha(data.modelo)
            );
            this.formulario.get('schema').setValue(this.serviceTenant.getSchemaTenant());
            this.spinner = false;
          } else {
            this.cnpjValido = false;
            this.spinner = false;
            Toaster.Warning('Este CNPJ não possui um e-mail cadastrado no sistema');
          }
        },
        error: (x: any) => {
          this.spinner = false;
          Toaster.Warning('Este CNPJ não possui um e-mail');
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  ngOnInit() {}

  buscarEmpresas(): void {
    this.spinner = true;
    if (this.formulario.get('user').value) {
      this.service
        .getCompanies(this.formulario.get('user').value)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.listEmpresas = data;
              this.cnpjValido = true;
            } else {
              Toaster.Warning('CNPJ Inválido!');
              this.listEmpresas = [];
              this.cnpjValido = false;
            }
          },
          error: () => {
            Toaster.Error('CNPJ Inválido!');
            this.listEmpresas = [];
            this.cnpjValido = false;
          },
          complete: () => {
            this.spinner = false;
          },
      });
    }
  }

  recuperar(): void {
    this.spinner = true;
    if (this.formulario.valid) {
      this.service
        .recuperarSenha(this.formulario.value)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            this.dialogRef.close();
            Toaster.Success(
              'Email de Recuperação enviado com sucesso, consulte sua caixa de email!'
            );
          },
          error: (error) => {
            this.spinner = false;
            Toaster.Error(
              'Não foi possível enviar seu email. Entre em contato com a loja!'
            );
          },
          complete: () => {
            this.spinner = false;
          },
        });
    } else {
      this.spinner = false;
      this.formulario.markAllAsTouched();
      Toaster.Warning(Toaster.msg.FormularioInvalido);
    }
  }
}
