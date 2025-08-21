import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { take } from 'rxjs';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FiltroPesquisarProdutos } from 'src/app/shared/classes/filtro-pesquisar-produtos';
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
    this.inicializarVinculo();
    this.obterListas();
    this.obterFiltros();
  }

  ngAfterViewInit(): void {
    this.valuesChanges();
    this.interceptarMudancasSubgrupo();
    this.interceptarMudancasMarca();
  }

  private inicializarVinculo(): void {
    // Se o vinculo for null ou undefined, inicializar como false
    if (this.storage.getVinculoGrupoSubGrupo() === null || this.storage.getVinculoGrupoSubGrupo() === undefined) {
      const currentData = this.storage.getDataStorage();
      if (currentData) {
        currentData.vinculoGrupoSubGrupo = false;
        this.storage.setDataStorage(currentData);
      }
    }
  }

  obterListas(): void {
    this.obterMarcas();
    this.obterGrupos();
    
    // SEMPRE carregar subgrupos inicialmente, independente do vínculo
    this.obterSubgrupos();
  }

  obterFiltros(): void {
    if (this.data?.filtro?.flag) {
      this.formulario.controls['marca'].setValue(this.data.filtro.marca);
      this.formulario.controls['idGrupo'].setValue(this.data.filtro.idGrupo);
      this.formulario.controls['idSubgrupo'].setValue(this.data.filtro.idSubgrupo);
    }
  }

  setFiltros(): any {
    let idSubgrupo = this.formulario.value.idSubgrupo ?? 0;
    let marca = this.formulario.value.marca ?? '';
    let idGrupo = this.formulario.value.idGrupo ?? 0;
    
    // Se o subgrupo selecionado for 0 (opção padrão), usar 0 para indicar "todos"
    if (idSubgrupo === 0 || idSubgrupo === '0') {
      idSubgrupo = 0;
    }
    
    // Se a marca selecionada for uma opção padrão, usar string vazia
    if (marca === 'Nenhuma marca disponível' || marca === 'Erro ao carregar marcas') {
      marca = '';
    }
    
    // Verificar se há algum filtro ativo
    const temFiltrosAtivos = (idGrupo && idGrupo !== 0 && idGrupo !== null && idGrupo !== undefined) || 
                            (idSubgrupo && idSubgrupo !== 0 && idSubgrupo !== null && idSubgrupo !== undefined) || 
                            (marca && marca.trim() !== '' && marca !== null && marca !== undefined);
    
    this.filtroPesquisaAvancada.idGrupo = idGrupo;
    this.filtroPesquisaAvancada.idSubgrupo = idSubgrupo;
    this.filtroPesquisaAvancada.marca = marca;
    this.filtroPesquisaAvancada.flag = temFiltrosAtivos;

    // Se não há filtros ativos, usar o mesmo formato da pesquisa por descrição
    if (!temFiltrosAtivos) {
      return new FiltroPesquisarProdutos({
        code: '',
        description: '',
        page: 1,
        promocaoSomenteCatalogo: false
      });
    }

    // Se há filtros ativos, usar o formato da pesquisa avançada
    return {
      idDepartamento: this.filtroPesquisaAvancada.idGrupo,
      idSubgrupo: this.filtroPesquisaAvancada.idSubgrupo,
      marca: this.filtroPesquisaAvancada.marca,
      page: 1,
    };
  }

  buscarProdutosFiltro(): void {
    this.spinner = true;
    const filtros = this.setFiltros();
    
    // Determinar qual endpoint usar baseado no tipo de filtro
    const observable = this.filtroPesquisaAvancada.flag 
      ? this.service.getProdutosFiltro(filtros)
      : this.service.getProdutosPesquisa(filtros);
    
    observable
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

  private limparSubgrupoSeNecessario(): void {
    const valorAtual = this.formulario.get('idSubgrupo')?.value;
    if (valorAtual === 0 || valorAtual === '0') {
      this.formulario.controls['idSubgrupo'].setValue(null);
    }
  }

  private limparMarcaSeNecessario(): void {
    const valorAtual = this.formulario.get('marca')?.value;
    if (valorAtual === 'Nenhuma marca disponível' || valorAtual === 'Erro ao carregar marcas') {
      this.formulario.controls['marca'].setValue(null);
    }
  }

  private obterMarcas(): void {
    this.loadListaMarcas = true;
    this.service
      .getMarcas()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data && Array.isArray(data) && data.length > 0) {
            this.listaMarcas = data;
          } else {
            // Adicionar opção padrão quando não há marcas
            this.listaMarcas = [
              { description: 'Nenhuma marca disponível' }
            ];
          }
        },
        error: (error) => {
          // Em caso de erro, também adicionar opção padrão
          this.listaMarcas = [
            { description: 'Erro ao carregar marcas' }
          ];
          
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
          if (data && Array.isArray(data) && data.length > 0) {
            this.listaSubgrupos = data;
          } else {
            // Adicionar opção padrão quando não há subgrupos para este grupo
            this.listaSubgrupos = [
              { id: 0, description: 'Nenhum subgrupo disponível para este grupo' }
            ];
          }
          this.validaSubgrupos();
        },
        error: (error) => {
          // Em caso de erro, também adicionar opção padrão
          this.listaSubgrupos = [
            { id: 0, description: 'Erro ao carregar subgrupos' }
          ];
          
          Toaster.Error('Erro ao carregar lista de subgrupos');
          this.loadListaSubgrupos = false;
          this.validaSubgrupos();
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
          if (data && Array.isArray(data) && data.length > 0) {
            this.listaSubgrupos = data;
          } else {
            // Adicionar opção padrão quando não há subgrupos
            this.listaSubgrupos = [
              { id: 0, description: 'Nenhum subgrupo disponível' }
            ];
          }
          this.validaSubgrupos();
        },
        error: (error) => {
          // Em caso de erro, também adicionar opção padrão
          this.listaSubgrupos = [
            { id: 0, description: 'Erro ao carregar subgrupos' }
          ];
          
          Toaster.Error('Erro ao carregar lista de subgrupos');
          this.loadListaSubgrupos = false;
          this.validaSubgrupos();
        },
        complete: () => {
          this.loadListaSubgrupos = false;
        },
      });
  }

  private valuesChanges(): void {
    this.formulario?.controls['idGrupo'].valueChanges.subscribe((x: any) => {
      const vinculo = this.storage.getVinculoGrupoSubGrupo();
      
      if (vinculo === true) {
        if (x) {
          this.obterSubgruposPorId(x);
          this.formulario.controls['idSubgrupo'].setValue(null);
        } else {
          this.formulario.controls['idSubgrupo'].setValue(null);
          // Adicionar opção padrão quando grupo é desmarcado
          this.listaSubgrupos = [
            { id: 0, description: 'Selecione um grupo primeiro' }
          ];
          this.validaSubgrupos();
        }
      }
    });
  }

  private interceptarMudancasSubgrupo(): void {
    this.formulario?.controls['idSubgrupo'].valueChanges.subscribe((x: any) => {
      // Se o valor selecionado for 0 (opção padrão), limpar a seleção
      if (x === 0 || x === '0') {
        console.log('🚫 Tentativa de selecionar opção padrão de subgrupo bloqueada');
        this.formulario.controls['idSubgrupo'].setValue(null);
      }
    });
  }

  private interceptarMudancasMarca(): void {
    this.formulario?.controls['marca'].valueChanges.subscribe((x: any) => {
      // Se o valor selecionado for uma opção padrão, limpar a seleção
      if (x === 'Nenhuma marca disponível' || x === 'Erro ao carregar marcas') {
        console.log('🚫 Tentativa de selecionar opção padrão de marca bloqueada');
        this.formulario.controls['marca'].setValue(null);
      }
    });
  }

  private validaSubgrupos(): void {
    // Sempre habilitar o campo se há opções (incluindo a padrão)
    if (this.listaSubgrupos.length > 0) {
      this.formulario.get('idSubgrupo')?.enable();
    } else {
      this.formulario.get('idSubgrupo')?.disable();
    }
    
    // Limpar subgrupo se for uma opção padrão
    this.limparSubgrupoSeNecessario();
    
    // Limpar marca se for uma opção padrão
    this.limparMarcaSeNecessario();
  }

  onMarcaChange(event: any): void {
    // Método para capturar mudanças na seleção de marca
  }
}
