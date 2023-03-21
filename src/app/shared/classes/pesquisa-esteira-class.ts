import { IFormularios } from "../interface/IFormularios";

export class PesquisaEsteiraClass implements IFormularios {
  idDepartamento: number;
  idSubDepartamento: number;
  idMontadora: number;
  idMarca: number;
  idModelo: number;
  modelo: string;
  ano: string;
  page: number;
  numbersPage: number;
  stepInicio: number;
  stepFim: number;
  totalPages: number;

  constructor() {
    this.idDepartamento = null;
    this.idSubDepartamento = null;
    this.idMontadora = null;
    this.idMarca = null;
    this.idModelo = null;
    this.modelo = null;
    this.ano = null;
    this.page = 1;
    this.numbersPage = 3;
    this.stepInicio = 2;
    this.stepFim = (this.numbersPage+this.stepInicio)-1;
    this.totalPages = 1;
  }

  getValidators(): any {
    const validators = [];
    return validators;
  }
}
