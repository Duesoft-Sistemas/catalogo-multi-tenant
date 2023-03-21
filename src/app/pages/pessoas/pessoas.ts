import { Validators } from '@angular/forms';
import { Formularios } from 'src/app/shared/functions/formularios';
import { IFormularios } from 'src/app/shared/interface/IFormularios';

export class Pessoas implements IFormularios {
  codEmpresa: number | null = null;
  tipoDocumento: boolean | null = null;
  nome: string | null = null;
  razao: string | null = null;
  cpfCnpj: string | null = null;
  // rg: string | null = null;
  numeroDddContato: string | null = null;
  numeroFoneContato: string | null = null;
  // codPais: number | null = null;
  // codEstado: number | null = null;
  // cep: string | null = null;
  // codMunicipio: number | null = null;
  // bairro: string | null = null;
  // rua: string | null = null;
  // numero: string | null = null;
  email: string | null = null;
  // emailAlternativo: string | null = null;

  //#region Auxiliares
  // senha: string | null = null;
  // confirmarSenha: string | null = null;
  // pais?: string | null = null;
  // municipio?: string | null = null;
  // estado?: string | null = null;
  // setor?: string | null = null;
  // municipioProfissional?: string | null = null;
  // estadoProfissional?: string | null = null;
  // administrador?: boolean | null = null;
  // codUsuario?: number | null = null;

  //#endregion

  constructor(values?: any) {
    this.tipoDocumento = values?.tipoDocumento ?? false;

    // this.estado =
    //   values?.estado instanceof Object
    //     ? values?.estado?.nome
    //     : values?.estado ?? null;
    Formularios.initModel<Pessoas>(this, values);
  }

  getValidators(): any[] {
    let validators = [];
    validators.push(['nome', [Validators.required, Validators.maxLength(100)]]);
    validators.push(['razao', [Validators.required, Validators.maxLength(100)]]);
    validators.push(['cnpj', [Validators.required, Validators.maxLength(14)]]);
    validators.push(['codEmpresa', [Validators.required]]);
    //validators.push(['rg', [Validators.required, Validators.maxLength(15)]]);
    // validators.push([
    //   'telefone',
    //   [Validators.required, Validators.maxLength(20)],
    // ]);
    //validators.push(['codPais', [Validators.required]]);
    //validators.push(['codEstado', [Validators.required]]);
    //validators.push(['cep', [Validators.required, Validators.maxLength(10)]]);
    // validators.push(['codMunicipio', [Validators.required]]);
    // validators.push([
    //   'bairro',
    //   [Validators.required, Validators.maxLength(50)],
    // ]);
    // validators.push(['rua', [Validators.required, Validators.maxLength(100)]]);
    // validators.push([
    //   'numero',
    //   [Validators.required, Validators.maxLength(10)],
    // ]);
    validators.push([
      'email',
      [Validators.required, Validators.email, Validators.maxLength(75)],
    ]);
    validators.push([
      'numeroDddContato',
      [Validators.required, Validators.maxLength(2)],
    ]);
    validators.push([
      'numeroFoneContato',
      [Validators.required, Validators.maxLength(9)],
    ]);
    // validators.push([
    //   'emailAlternativo',
    //   [Validators.email, Validators.maxLength(75)],
    // ]);

    // validators.push([
    //   'senha',
    //   [Validators.required, Validators.minLength(6), Validators.maxLength(12)],
    // ]);
    // validators.push([
    //   'confirmarSenha',
    //   [Validators.required, Validators.minLength(6), Validators.maxLength(12)],
    // ]);

    return validators;
  }
}
