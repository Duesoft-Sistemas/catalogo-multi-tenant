import { IFormularios } from "src/app/shared/interface/IFormularios";

export class ModalPesquisaAvancada implements IFormularios {
  marca: string | null;
  idGrupo: number | null;
  idSubgrupo: number | null;

  constructor() {
    this.marca = null;
    this.idGrupo = null;
    this.idSubgrupo = null;
  }

  getValidators(): any {
    return [
      ['marca'],
      ['idGrupo'],
      ['idSubgrupo'],
    ]
  }
}
