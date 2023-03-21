import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css'],
})
export class FornecedoresComponent implements OnInit {
  spinner = false;
  totalPaginas: number;
  maxSizePaginator = 5;
  formEsteira: FormGroup;
  listFornecedores = [];
  listImagemFornecedores = [];
  @Output() pageChanged = new EventEmitter();

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService
  ) {}

  ngOnInit() {
    this.storage.setTitlePage('Fornecedores');
    this.spinner = true;

    this.service
      .getFornecedores()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          this.listFornecedores = data;
          this.totalPaginas = this.listFornecedores.length / 9;
          this.spinner = false;
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
