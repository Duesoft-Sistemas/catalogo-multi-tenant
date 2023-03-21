import { Validators } from "@angular/forms";
import { IFormularios } from "../interface/IFormularios";

export class AlterarSenha implements IFormularios {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  constructor(values?: any) {
    this.oldPassword = values ? values.oldPassword : null;
    this.newPassword = values ? values.newPassword : null;
    this.confirmNewPassword = values ? values.confirmNewPassword : null;
  }

  getValidators() {
    return [
      ['oldPassword', [Validators.required]],
      ['newPassword', [Validators.required]],
      ['confirmNewPassword', [Validators.required]],
    ];
  }
}
