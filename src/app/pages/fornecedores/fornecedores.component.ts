import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { TenantService } from 'src/app/shared/tenant/tenant.service';

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
  formEsteira: FormGroup;
  listFornecedores = [];
  listImagemFornecedores = [];
  @Output() pageChanged = new EventEmitter();

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService,
    private tenantService: TenantService
  ) {
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
          if (data) {
            this.listFornecedores = data;
            this.totalPaginas = this.listFornecedores.length / 9;
            this.spinner = false;

            if (this.listFornecedores.length <= 0) {
              Toaster.Warning('Nenhum fornecedor encontrado.');
            }
          } else {
            Toaster.Warning('Nenhum fornecedor encontrado.');
          }
        },
        error: (error) => {
          Toaster.Error(Toaster.msg.ErroCarregarDados);
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }
}
