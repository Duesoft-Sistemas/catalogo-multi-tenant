import { IFormularios } from "../interface/IFormularios";

export class FiltroPedidosRealizados implements IFormularios{
  initialDate: Date;
  finalDate: Date;
  status: number[];

  constructor(values?: any){
    this.initialDate = values ? values.initialDate : null;
    this.finalDate = values ? values.finalDate : null;
    this.status = values? values.status : [];
  }

  getValidators() {
    return [];
  }
}
