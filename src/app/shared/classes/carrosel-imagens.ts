import { IFormularios } from "../interface/IFormularios";

export class CarroselImagens implements IFormularios {
  caminhoPlanoFundoCatalogo: string;
  caminhoPlanoFundoCatalogo2: string;
  caminhoPlanoFundoCatalogo3: string;
  constructor() {
    this.caminhoPlanoFundoCatalogo = null;
    this.caminhoPlanoFundoCatalogo2 = null;
    this.caminhoPlanoFundoCatalogo3 = null;
  }
 
  getValidators(): any {
    const validators = [];
    return validators;
  }
}
