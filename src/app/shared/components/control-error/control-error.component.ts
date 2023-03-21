import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-control-error',
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.css'],
})
export class ControlErrorComponent implements OnInit {
  @Input() inputMsgError: string;
  @Input() form: FormGroup;
  @Input() control: any;
  @Input() onSubmit?: boolean;

  constructor() {}

  ngOnInit() {}

  verificaValidTouched(): boolean {
    return (
      !this.form.get(this.control).valid && this.form.get(this.control).touched
    );
  }

  msgErroCustom(): string {
    if (this.inputMsgError) {
      return this.inputMsgError;
    } else if (this.form.get(this.control).errors) {
      if (this.form.get(this.control).errors['required']) {
        return 'Campo obrigatório';
      }
      if (this.form.get(this.control).errors['bsDate']) {
        return 'Data inválida';
      }
      if (this.form.get(this.control).errors['email']) {
        return 'Formato de email inválido';
      }
      if (this.form.get(this.control).errors['cpf']) {
        return 'CPF inválido';
      }
      if (this.form.get(this.control).errors['cnpj']) {
        return 'CNPJ inválido';
      }
      if (this.form.get(this.control).errors['cep']) {
        return 'CEP inválido';
      }
      if (this.form.get(this.control).errors['telefone']) {
        return 'Telefone inválido';
      }
    }
    return '';
  }
}
