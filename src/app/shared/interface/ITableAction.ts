import { TableActions } from "../enums/table-actions.enum";

export interface ITableAction {
  row: any;
  actioin: TableActions;
}
