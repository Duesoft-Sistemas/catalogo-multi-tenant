import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableActions } from '../../enums/table-actions.enum';
import { Table } from '../../functions/table';
import { ITableAction } from '../../interface/ITableAction';

@Component({
  selector: 'app-table-model',
  templateUrl: './table-model.component.html',
  styleUrls: ['./table-model.component.css'],
})
export class TableModelComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() columns!: any[];
  @Output() action = new EventEmitter<ITableAction | any>();
  @Output() clickedRow = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns?: string[];
  tableActions = TableActions;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.displayedColumns = this.columns?.map((c) => c.columnDef);
    Table.atualizaTable(this.dataSource, this.paginator);
  }

  ngAfterViewInit(): void {
    Table.translateTable(this.paginator);
  }

  clickRow(row: any): any {
    this.clickedRow.emit(row);
  }

  getPrice(price: any): number {
    return price?.replace(',', '.') as number;
  }
}
