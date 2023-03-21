export interface IRelatorioFinanceiro {
  documento: any;
  dtConta: Date | string;
  dtVencto: Date | string;
  dtPagto: Date | string;
  vl: number | string;
  vlPago: number | string;
}
