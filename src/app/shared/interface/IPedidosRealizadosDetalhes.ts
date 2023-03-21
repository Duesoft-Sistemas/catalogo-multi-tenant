export class IPedidosRealizadosDetalhes {
  company: string;
  solicitationNumber: number;
  orderNumber: number;
  status: string;
  orderDate: Date;
  totalPrice: number | string;
  appTotalPrice: number | string;
  itens: IItensPedidosRealizadosDetalhes[];
}

export interface IItensPedidosRealizadosDetalhes {
  code: string;
  description: string;
  unity: string;
  qtd: number | string;
  price: number | string;
  totalPrice: number | string;
  appQtd: number | string;
  appPrice: number | string;
  appTotalPrice: number | string;
}
