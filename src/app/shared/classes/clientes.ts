import { IFormularios } from "../interface/IFormularios";

export class Clientes implements IFormularios {
  cliente1: boolean;
  cliente2: boolean;
  cliente3: boolean;
  cliente4: boolean;
  cliente5: boolean;
  cliente6: boolean;
  cliente7: boolean;

  constructor() {
    this.cliente1 = false;
    this.cliente2 = false;
    this.cliente3 = false;
    this.cliente4 = false;
    this.cliente5 = false;
    this.cliente6 = false;
    this.cliente7 = false;
  }

  getValidators(): any {
    const validators = [];
    return validators;
  }
}
