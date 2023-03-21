import { Validators } from "@angular/forms";
import { IFormularios } from "../interface/IFormularios";

export class RecuperarSenha implements IFormularios {
  user: string;
  company: string;
  email: string;
  schema: string;

  constructor(values?: any){
    this.user = values ? values.cnpj : null;
    this.company = values? values.company : null;
    this.email = values ? values.email : null;
    this.schema = values? values.schema : null;
  }

  getValidators() {
    return[
      ['cnpj',[Validators.required]],
      ['company',[Validators.required]]
    ];
}
}
