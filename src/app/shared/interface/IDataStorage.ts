import { CarroselImagens } from "../classes/carrosel-imagens";
import { ProdutoCarrinho } from "../classes/produto-carrinho";

export interface IDataStorage {
  authorization: string;
	refreshToken?: string;
	data?: string;
  planoFundo?: CarroselImagens;
  logoPaisagem?: string;
  logoRetrato?: string;
	userName?: string;
  carrinho: ProdutoCarrinho[];
  titlePage: string;
  vinculoGrupoSubGrupo: boolean;
}
