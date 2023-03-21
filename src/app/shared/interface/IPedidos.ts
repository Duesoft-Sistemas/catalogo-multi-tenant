export interface IPedidos {
  solicitationNumber: number;
  orderNumber: number;
  status: string;
  orderDate: Date;
  totalPrice: string | number;
}
