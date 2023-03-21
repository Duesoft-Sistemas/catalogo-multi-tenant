import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IDataStorage } from 'src/app/shared/interface/IDataStorage';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';
import { UsuarioLogin } from '../login/login.model';
import { PrimeiroAcessoComponent } from '../primeiro-acesso/primeiro-acesso.component';
import { RecuperarSenhaComponent } from '../recuperar-senha/recuperar-senha.component';
import { CadastrarSeComponent } from '../sem-autenticacao/cadastrar-se/cadastrar-se.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  listEmpresas = [];
  toast = Toaster;
  spinner = false;
  formulario: FormGroup;
  cnpjValido = false;
  modelo: UsuarioLogin = new UsuarioLogin();
  submeter = false;
  autenticado = false;
  modeloRecuperarSenha: UsuarioLogin = new UsuarioLogin();
  cnpjRecuperarSenhaValido = false;
  constructor(
    private authStorageService: AuthStorageService,
    private service: GlobalService,
    private router: Router,
    private appComponent: AppComponent,
    public dialog: MatDialog
  ) {

    this.autenticado = appComponent.autenticado;
    if (localStorage.getItem('tokenCatalogo')) {
      this.router.navigate(['inicio']);
    }
  }

  openModalCadastrarse(): void {
    this.dialog.open(CadastrarSeComponent, {
      disableClose: true,
    });
  }

  ngOnInit(): void {
    this.formulario = Formularios.geraFormulario(this.modelo);
  }

  validarCnpj(recuperarSenha?): void {
    this.spinner = true;
    this.service
      .getCompanies(this.formulario.get('user')?.value)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data && recuperarSenha && !data[0].firstAcess) {
            this.cnpjRecuperarSenhaValido = true;
            this.modeloRecuperarSenha;
            this.modeloRecuperarSenha.schema = environment.Schema;
            this.modeloRecuperarSenha.user = this.formulario.get('user')?.value;
            this.modeloRecuperarSenha.company = data[0].companyCnpj;
            this.openModalRecuperarSenha();
          } else if (data && !recuperarSenha) {
            this.listEmpresas = data;
            this.cnpjValido = true;
            this.modelo = new UsuarioLogin();
            this.modelo.schema = environment.Schema;
            this.modelo.user = this.formulario.get('user')?.value;
            this.modelo.company = this.listEmpresas[0].companyCnpj;
            this.formulario = Formularios.geraFormulario(this.modelo);
            if (this.listEmpresas[0].firstAcess)
              this.openModalPrimeiroacesso(this.modelo);
          } else {
            Toaster.Warning('CNPJ inválido');
            this.listEmpresas = [];
            this.cnpjValido = false;
          }
        },
        error: () => {
          Toaster.Error('CNPJ inválido');
          this.listEmpresas = [];
          this.cnpjValido = false;
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  efetuarLogin(): void {
    this.service
      .login(this.formulario.value)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            let dataStorage: IDataStorage = data;
            dataStorage.titlePage = 'Início';
            dataStorage.carrinho = [];
            dataStorage.planoFundo = data.caminhosPlanoFundo;
            if(dataStorage.planoFundo.caminhoPlanoFundoCatalogo == '')
            {
              dataStorage.planoFundo.caminhoPlanoFundoCatalogo = null;
              dataStorage.planoFundo.caminhoPlanoFundoCatalogo2 = null;
              dataStorage.planoFundo.caminhoPlanoFundoCatalogo3 = null;
            }
            this.authStorageService.setDataStorage(dataStorage);
            this.spinner = false;
            this.router.navigate(['']);
            this.appComponent.autenticado = true;
          } else {
            this.toast.Error('Senha inválida.');
            this.appComponent.autenticado = false;
            this.spinner = false;
          }
        },
        error: (error) => {
          this.appComponent.autenticado = false;
          this.toast.Error(Toaster.msg.CredenciaisError);
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  openModalPrimeiroacesso(modelo) {
    this.dialog.open(PrimeiroAcessoComponent, {
      data: modelo,
      width: '350px',
    });
  }

  openModalRecuperarSenha() {
    if (this.cnpjRecuperarSenhaValido)
      this.dialog.open(RecuperarSenhaComponent, {
        data: {
          cnpjValido: this.cnpjRecuperarSenhaValido,
          modelo: {
            cnpj: this.modeloRecuperarSenha.user,
            email: null,
            schema: this.modeloRecuperarSenha.schema,
            company: this.modeloRecuperarSenha.company,
          },
        },
        width: '350px',
      });
    else Toaster.Error('CNPJ inválido');
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
