import { FormArray, FormControl, FormGroup } from "@angular/forms";

export class Formularios {
  static geraFormulario(modelo: any): FormGroup {
    let formulario: FormGroup = new FormGroup({});

    formulario = this.geraFormControls(formulario, modelo);
    if (modelo.getValidators()) {
      formulario = this.geraValidators(formulario, modelo.getValidators());
    }

    return formulario;
  }

  private static geraFormControls(formulario: FormGroup, modelo: any): FormGroup {
    if (modelo) {
      Object.keys(modelo).map((campo) => {
        if (Array.isArray(modelo[campo]) && modelo[campo][0] instanceof Object) {
          formulario.addControl(campo.toString(), this.geraFormArray(modelo[campo]));
        } else {
          formulario.addControl(campo.toString(), new FormControl(modelo[campo]));
        }
      });
    }
    return formulario;
  }

  private static geraValidators(formulario: FormGroup, validators: any): FormGroup {
    if (validators) {
      validators.map(
        (controle: any) => {
          formulario.get(controle[0])?.setValidators(controle[1]);
          formulario.get(controle[0])?.updateValueAndValidity();
        });
    }
    return formulario;
  }

  private static geraFormArray(obj: any): FormArray {
    let group: FormGroup;
    const arrayForm = new FormArray<any>([]);
    obj.map((modelo: any) => {
      group = new FormGroup({});
      Object.keys(modelo).map((campo) => {
        group.addControl(campo.toString(), new FormControl(modelo[campo]));
      });
      group = this.geraValidators(group, modelo.getValidators());
      arrayForm.push(group);
    });
    return arrayForm;
  }

  static geraFormGroupPorClasse(objClass: any): FormGroup {
    let group: FormGroup;
    group = new FormGroup({});
    Object.keys(objClass).map((campo: any) => {
      group.addControl(campo.toString(), new FormControl(objClass[campo]));
    });
    group = this.geraValidators(group, objClass.getValidators());
    return group;
  }

  static atualizaFormArray(formGroup: FormGroup, campoFormGroup: string): FormArray {
    return formGroup.get(campoFormGroup) as FormArray;
  }

  static validTouched(form: FormControl): boolean {
    return (!form.valid && form.touched);
  }

  static msgErroCustom(form: FormControl): any {
    if (form.errors) {
      if (form.errors['required']) return 'Campo obrigatório';
      if (form.errors["min"]) return 'Campo inválido, valor deve ser maior que ';
      if (form.errors["max"]) return 'Valor inválido';
      if (form.errors["minlength"]) return 'Mínimo ' + form.errors["minlength"].requiredLength + ' caracteres';
      if (form.errors["maxlength"]) return 'Máximo ' + form.errors["maxlength"].requiredLength + ' caracteres';
      if (form.errors["bsDate"]) return 'Data inválida';
      if (form.errors["email"]) return 'Formato de email inválido';
      if (form.errors["cpf"]) return 'CPF inválido';
      if (form.errors["cnpj"]) return 'CNPJ inválido';
      if (form.errors["cep"]) return 'CEP inválido';
      if (form.errors["telefone"]) return 'Telefone inválido';
      if (form.errors["senhasDiferentes"]) return 'Senhas não coincidem';
      return '';
    }
  }

  static getRequired(form: FormControl | any, controlName: string): string {
    return form.controls[controlName]?._rawValidators?.find((x: any) => x.name === 'required') ? ' required' : '';
  }

  static initModel<T>(model: T, values: any): void {
    for (const property in model) {
      if (model[property] === null) model[property] = values ? values[property] ?? null : null;
    }
  }
}
