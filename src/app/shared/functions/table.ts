import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export class Table {
  static translateTable(paginator: MatPaginator): MatPaginator {
    paginator._intl.itemsPerPageLabel = 'Registros por página';
    paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
    return paginator;
  }

  static translateTableExibirPorPagina(paginator: MatPaginator): MatPaginator {
    paginator.hidePageSize = true;
    paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      return (page + 1) + ' de ' + paginator.getNumberOfPages();
    };
    return paginator;
  }

  static atualizaTable(
    dataSource: MatTableDataSource<any>,
    paginator: MatPaginator,
    sort?: MatSort
  ): void {
    if (paginator) dataSource.paginator = paginator;
    if (sort) dataSource.sort = sort;
  }
}
