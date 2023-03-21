import { Validators } from "@angular/forms";
import { IFormularios } from "../interface/IFormularios";

export class PrimeiroAcesso implements IFormularios {
  user: string;
  company: string;
  email: string;
  schema: string;
  password: string;
  confirmPassword: string;

  constructor(values?: any){
    this.user = values ? values.user : null;
    this.company = values? values.company : null;
    this.email = values ? values.email : null;
    this.schema = values? values.schema : null;
    this.password = values ? values.password : null;
    this.confirmPassword = values ? values.confirmPassword : null;
  }

  getValidators() {
    return[
      ['cnpj',[Validators.required]],
      ['company',[Validators.required]],
      ['password',[Validators.required]],
      ['confirmPassword',[Validators.required]]
    ];
}
}
