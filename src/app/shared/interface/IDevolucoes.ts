export interface IDevolucoes {
  codigo: number;
  codDevolucao: string | number;
  codPedido: number;
  faturado: boolean;
  orderDate: any;
  totalPrice: number;
  dsCodCliente: string | number;
  dsCodProduto: string | number;
  produto: string;
}
