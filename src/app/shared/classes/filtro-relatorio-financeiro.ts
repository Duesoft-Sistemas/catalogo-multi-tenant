import { IFormularios } from '../interface/IFormularios';

export class FiltroRelatorioFinanceiro implements IFormularios {
  dataVencimentoInicial: Date;
  dataVencimentoFinal: Date;
  pagina: number;

  constructor(values?: any) {
    this.dataVencimentoInicial = values ? values.dataVencimentoInicial : null;
    this.dataVencimentoFinal = values ? values.dataVencimentoFinal : null;
    this.pagina = values ? values.pagina ?? 1 : 1;
  }

  getValidators() {
    return [];
  }

  getFiltro(): any {
    return {
      dataVencimentoInicial: this.dataVencimentoInicial
        ? `${this.dataVencimentoInicial.getFullYear()}-${
            this.dataVencimentoInicial.getMonth() + 1
          }-${this.dataVencimentoInicial.getDate()}`
        : null,
      dataVencimentoFinal: this.dataVencimentoFinal
        ? `${this.dataVencimentoFinal.getFullYear()}-${
            this.dataVencimentoFinal.getMonth() + 1
          }-${this.dataVencimentoFinal.getDate()}`
        : null,
      pagina: this.pagina,
    };
  }
}
