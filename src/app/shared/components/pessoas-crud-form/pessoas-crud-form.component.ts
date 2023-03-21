import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Formularios } from '../../functions/formularios';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { GlobalService } from '../../services/global.service';
import { take } from 'rxjs';
import { Toaster } from '../../functions/toaster';

@Component({
  selector: 'app-pessoas-crud-form',
  templateUrl: './pessoas-crud-form.component.html',
  styleUrls: ['./pessoas-crud-form.component.css'],
})
export class PessoasCrudFormComponent implements OnInit, AfterViewInit {
  @Input() form!: FormGroup | any;
  @Input() update!: boolean;
  spinner = false;
  listEmpresas = [];
  loadListEmpresas = true;
  // listPaises!: IPaises[];
  // listEstados!: IEstados[];
  // listMunicipios!: IMunicipios[];

  formularios = Formularios;

  constructor(
    // private paisesService: PaisesService,
    // private estadosService: EstadosService,
    // private municipiosService: MunicipiosService
    private service: GlobalService,
  ) {}

  ngAfterViewInit(): void {
    this.valuesChanges();
  }

  ngOnInit() {
    //this.carregaListas();
    this.getAllCompanies();
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

  private valuesChanges(): void {
    this.form?.controls['tipoDocumento'].valueChanges.subscribe((x: any) => {
      this.form.get('cpfCnpj').setValue(null);
      let validators: any;
      if (x) {
        validators = [Validators.required, Validators.maxLength(14)];
      } else {
        validators = [Validators.required, Validators.maxLength(11)];
      }
      this.form.get('cpfCnpj').setValidators(validators);
      this.form.get('cpfCnpj').updateValueAndValidity();
    });
  }

  verificaCnpj(): void {
    let formCnpj = this.form.get('cpfCnpj');
    if (formCnpj.touched && formCnpj.dirty) {
      if (!cnpj.isValid(formCnpj.value)) {
        this.form.get('cpfCnpj')?.setErrors({ cnpj: true });
      } else {
        this.form.get('cpfCnpj')?.setErrors(null);
      }
    }
  }

  verificaCpf(): void {
    let formCpf = this.form.get('cpfCnpj');
    if (formCpf.touched && formCpf.dirty) {
      if (!cpf.isValid(formCpf.value)) {
        this.form.get('cpfCnpj')?.setErrors({ cpf: true });
      } else {
        this.form.get('cpfCnpj')?.setErrors(null);
      }
    }
  }

  // private carregaListas(): void {
  //   let error = false;

  //   this.paisesService
  //     .getAll(true)
  //     .then((x: any) => (this.listPaises = x))
  //     .catch((x) => (error = true));
  //   this.estadosService
  //     .getAll(true)
  //     .then(async (x: any) => {
  //       this.listEstados = x;
  //       let ufEstado = this.listEstados.find(
  //         (x: IEstados) => x.codigo === this.form.get('codEstado').value
  //       )?.sigla;
  //       if (ufEstado) this.carregaMunicipiosPorUf(ufEstado);
  //     })
  //     .catch(() => (error = true));
  //   if (error) Toaster.Error('Ocorreu um erro ao carregar dados das listas!');
  // }

  // carregaMunicipiosPorUf(uf: string): void {
  //   this.municipiosService
  //     .getByUf(uf)
  //     .then((municipios: any) => {
  //       this.listMunicipios = municipios;
  //     })
  //     .catch((x) => {
  //       Toaster.Error('Ocorreu um erro ao carregar dados das listas!');
  //     });
  // }

  // verificaSenhasIguais(): void {
  //   const senha = this.form.get('senha');
  //   const confirmarSenha = this.form.get('confirmarSenha');

  //   if ((senha.touched && confirmarSenha.touched)) {
  //     if (senha.dirty && senha?.value?.trim() !== '' && confirmarSenha.dirty && confirmarSenha?.value?.trim() !== '') {
  //       if (senha.value !== confirmarSenha.value) {
  //         this.form.get('senha')?.setErrors({ senhasDiferentes: true });
  //         this.form.get('confirmarSenha')?.setErrors({ senhasDiferentes: true });
  //       } else {
  //         this.form.get('senha')?.setErrors(null);
  //         this.form.get('confirmarSenha')?.setErrors(null);
  //       }
  //       this.form.updateValueAndValidity();
  //     }
  //   }
  // }
}
