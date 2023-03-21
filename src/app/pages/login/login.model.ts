import { Validators } from "@angular/forms";

export class UsuarioLogin {
  userName: string | null;
  user: string | null;
  password: string | null;
  company: string | null;
  schema: string | null;

  constructor() {
    this.userName = null;
    this.user = null;
    this.password = null;
    this.company = null;
    this.schema = null;
  }

  getValidators(): any {
    const validators = [];
    validators.push(['user', [Validators.required]]);
    validators.push(['password', [Validators.required]]);
    validators.push(['company', [Validators.required]]);
    return validators;
  }
}
