import { SafeUrl } from "@angular/platform-browser";

export interface IProdutos {
  id: number;
  code: string;
  companyId: number;
  productGroup: string;
  productSubgroup: string;
  description: string;
  marcaPecaProduto: string;
  completeDescription: string;
  linha: string;
  price: string;
  price2: string;
  observations: string;
  unity: string;
  unity2: string;
  stock: number;
  stockStatus: string;
  unitiesOnPackage: number;
  unitiesOnPackage2: number;
  image: string;
  conversions: string;
  similar: IProdutos[];
  images: Images[];
  applications: Applications[];
  originalCodes: OriginalCodes[];
  emPromocao: boolean;
  imageSafe: SafeUrl;
  unidadeEscolhida:string;
}

export interface OriginalCodes{
  originalCode: string;
}

export interface Applications{
  description: string;
}

export interface Images{
  caminho: string;
  caminhoSafe: SafeUrl;
}
