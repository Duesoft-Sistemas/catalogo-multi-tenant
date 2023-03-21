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
  price: number;
  observations: string;
  unity: string;
  stock: number;
  stockStatus: string;
  unitiesOnPackage: number;
  image: string;
  conversions: string;
  similar: IProdutos[];
  images: Images[];
  applications: Applications[];
  originalCodes: OriginalCodes[];
  emPromocao: boolean;
}

export interface OriginalCodes{
  originalCode: string;
}

export interface Applications{
  description: string;
}

export interface Images{
  caminho: string;
}
