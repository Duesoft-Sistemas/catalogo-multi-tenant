import { IFormularios } from '../interface/IFormularios';

export class FiltroPesquisarProdutos implements IFormularios {
  code: string;
  release: string;
  description: string;
  page: number;
  promocaoSomenteCatalogo: boolean;

  constructor(values?: any) {
    this.code = values ? values.code : null;
    this.release = values ? values.release : null;
    this.description = values ? values.description : null;
    this.page = values ? values.page : 1;
    this.promocaoSomenteCatalogo = values
      ? values.promocaoSomenteCatalogo
      : false;
  }

  getValidators() {
    return [];
  }
}
