import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { take } from 'rxjs';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FiltroPesquisaAvancada } from './filtro-pesquisa-avancada';
import { ModalPesquisaAvancada } from './modal-pesquisa-avancada';

@Component({
  selector: 'app-modal-pesquisa-avancada',
  templateUrl: './modal-pesquisa-avancada.component.html',
  styleUrls: ['./modal-pesquisa-avancada.component.css'],
})
export class ModalPesquisaAvancadaComponent implements OnInit, AfterViewInit {
  spinner = true;
  formulario!: FormGroup;
  listaMarcas: any[] = [];
  loadListaMarcas = false;
  listaGrupos: any[] = [];
  loadListaGrupos = false;
  listaSubgrupos: any[] = [];
  loadListaSubgrupos = false;

  filtroPesquisaAvancada = FiltroPesquisaAvancada;

  constructor(
    public dialogRef: MatDialogRef<ModalPesquisaAvancadaComponent>,
    private service: GlobalService,
    private storage: AuthStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.spinner = false;
    this.formulario = Formularios.geraFormulario(new ModalPesquisaAvancada());
  }

  ngOnInit() {
    this.obterListas();
    this.obterFiltros();
  }

  ngAfterViewInit(): void {
    this.valuesChanges();
  }

  obterListas(): void {
    this.obterMarcas();
    this.obterGrupos();
    if (this.storage.getVinculoGrupoSubGrupo() === false) {
      this.obterSubgrupos();
    } else if (
      this.storage.getVinculoGrupoSubGrupo() === true &&
      this.data.filtro.idGrupo
    ) {
      this.obterSubgruposPorId(this.data.filtro.idGrupo);
      this.validaSubgrupos();
    } else {
      this.validaSubgrupos();
    }
  }

  obterFiltros(): void {
    if (this.data.filtro.flag) {
      this.formulario.controls['marca'].setValue(this.data.filtro.marca);
      this.formulario.controls['idGrupo'].setValue(this.data.filtro.idGrupo);
      this.formulario.controls['idSubgrupo'].setValue(
        this.data.filtro.idSubgrupo
      );
    }
  }

  setFiltros(): any {
    this.filtroPesquisaAvancada.idGrupo = this.formulario.value.idGrupo ?? 0;
    this.filtroPesquisaAvancada.idSubgrupo =
      this.formulario.value.idSubgrupo ?? 0;
    this.filtroPesquisaAvancada.marca = this.formulario.value.marca;
    this.filtroPesquisaAvancada.flag = true;

    return {
      idDepartamento: this.filtroPesquisaAvancada.idGrupo,
      idSubgrupo: this.filtroPesquisaAvancada.idSubgrupo,
      marca: this.filtroPesquisaAvancada.marca,
      page: 1,
    };
  }

  buscarProdutosFiltro(): void {
    this.spinner = true;
    this.service
      .getProdutosFiltro(this.setFiltros())
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            if (data.produtos.length <= 0) {
              Toaster.Warning('Nenhum produto encontrado.');
            } else {
              data.filtro = this.filtroPesquisaAvancada;
              this.dialogRef.close(data);
            }
          } else {
            Toaster.Warning('Nenhum produto encontrado.');
          }
        },
        error: (error) => {
          Toaster.Error('Erro ao buscar os produtos.');
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  cancelar(): void {
    this.dialogRef.close(this.data);
  }

  limpar(): void {
    this.formulario.controls['marca'].setValue(null);
    this.formulario.controls['idGrupo'].setValue(null);
    this.formulario.controls['idSubgrupo'].setValue(null);

    this.data.filtro.idGrupo = 0;
    this.data.filtro.idSubgrupo = 0;
    this.data.filtro.marca = '';
    this.data.filtro.flag = false;
  }

  private obterMarcas(): void {
    this.loadListaMarcas = true;
    this.service
      .getMarcas()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.listaMarcas = data;
          } else {
            this.listaMarcas = [];
          }
        },
        error: (error) => {
          Toaster.Error('Erro ao carregar lista de marcas');
          this.loadListaMarcas = false;
        },
        complete: () => {
          this.loadListaMarcas = false;
        },
      });
  }

  private obterGrupos(): void {
    this.loadListaGrupos = true;
    this.service
      .getGrupos()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.listaGrupos = data;
          } else {
            this.listaGrupos = [];
          }
        },
        error: (error) => {
          Toaster.Error('Erro ao carregar lista de grupos');
          this.loadListaGrupos = false;
        },
        complete: () => {
          this.loadListaGrupos = false;
        },
      });
  }

  private obterSubgruposPorId(id: number): void {
    this.loadListaSubgrupos = true;
    this.service
      .getSubgruposPorId(id)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.listaSubgrupos = data;
          } else {
            this.listaSubgrupos = [];
          }
          this.validaSubgrupos();
        },
        error: (error) => {
          Toaster.Error('Erro ao carregar lista de subgrupos');
          this.loadListaSubgrupos = false;
        },
        complete: () => {
          this.loadListaSubgrupos = false;
        },
      });
  }

  private obterSubgrupos(): void {
    this.loadListaSubgrupos = true;
    this.service
      .getSubgrupos()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.listaSubgrupos = data;
          } else {
            this.listaSubgrupos = [];
          }
          this.validaSubgrupos();
        },
        error: (error) => {
          Toaster.Error('Erro ao carregar lista de subgrupos');
          this.loadListaSubgrupos = false;
        },
        complete: () => {
          this.loadListaSubgrupos = false;
        },
      });
  }

  private valuesChanges(): void {
    this.formulario?.controls['idGrupo'].valueChanges.subscribe((x: any) => {
      if (this.storage.getVinculoGrupoSubGrupo()) {
        if (this.storage.getVinculoGrupoSubGrupo() === true) {
          if (x) {
            this.obterSubgruposPorId(x);
            this.formulario.controls['idSubgrupo'].setValue(null);
          } else {
            this.formulario.controls['idSubgrupo'].setValue(null);
            this.listaSubgrupos = [];
            this.validaSubgrupos();
          }
        }
      }
    });
  }

  private validaSubgrupos(): void {
    if (this.listaSubgrupos.length === 0) {
      this.formulario.get('idSubgrupo')?.disable();
    } else {
      this.formulario.get('idSubgrupo')?.enable();
    }
  }
}
