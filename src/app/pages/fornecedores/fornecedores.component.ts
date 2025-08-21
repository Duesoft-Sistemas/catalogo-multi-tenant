import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Toaster } from 'src/app/shared/functions/toaster';
import { TenantService } from 'src/app/shared/tenant/tenant.service';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css'],
})
export class FornecedoresComponent implements OnInit {
  schema = '';
  spinner = false;
  totalPaginas: number;
  maxSizePaginator = 5;
  formEsteira: any; // Changed from FormGroup to any as FormGroup is removed
  listFornecedores = [];
  listImagemFornecedores = [];
  productCount: number = 0;
  // @Output() pageChanged = new EventEmitter(); // Removed as per new_code

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService,
    private tenantService: TenantService
  ) {
    this.schema = this.tenantService.getSchemaTenant();
    this.schema = this.tenantService.getSchemaTenant();
  }

  ngOnInit() {
    this.storage.setTitlePage('Fornecedores');
    this.spinner = true;

    this.service
      .getFornecedores()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data && Array.isArray(data) && data.length > 0) {
            this.listFornecedores = data;
            this.totalPaginas = Math.ceil(this.listFornecedores.length / 9);
            this.spinner = false;
          } else {
            this.listFornecedores = [];
            this.totalPaginas = 0;
            this.spinner = false;
            Toaster.Warning('Nenhum fornecedor encontrado.');
          }
        },
        error: (error) => {
          console.error('Erro ao carregar fornecedores:', error);
          this.listFornecedores = [];
          this.totalPaginas = 0;
          Toaster.Error('Nenhum fornecedor encontrado.');
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  onProductCountChanged(count: number) {
    this.productCount = count;
  }
}
