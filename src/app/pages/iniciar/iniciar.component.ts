import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { take } from 'rxjs';

// Models and Classes
import { PesquisaEsteiraClass } from 'src/app/shared/classes/pesquisa-esteira-class';
import { SeletorPeculiaridadesCatalogos } from 'src/app/shared/classes/seletor-peculiaridades-catalogos';
import { FiltroPesquisarProdutos } from 'src/app/shared/classes/filtro-pesquisar-produtos';
import { FiltroPesquisaAvancada } from './modal-pesquisa-avancada/filtro-pesquisa-avancada';

// Components
import { FiltroProdutosComponent } from 'src/app/shared/components/filtro-produtos/filtro-produtos.component';
import { ModalPesquisaAvancadaComponent } from './modal-pesquisa-avancada/modal-pesquisa-avancada.component';

// Enums and Interfaces
import { KeyboardKey } from 'src/app/shared/enums/keyboard-key.enum';
import { IProdutos } from 'src/app/shared/interface/IProdutos';

// Types
import { 
  SearchResponse, 
  AdvancedSearchResult, 
  BackgroundStyle, 
  FormEsteira,
  ModalData 
} from 'src/app/shared/types/app.types';

// Services
import { AuthStorageService } from 'src/app/core/guards/auth-storage.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { TenantService } from 'src/app/core/tenant/tenant.service';

// Utilities
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { APP_CONSTANTS } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.component.html',
  styleUrls: ['./iniciar.component.scss'],
})
export class IniciarComponent implements OnInit {

  // Properties
  public spinner = false;
  public descricao = '';
  public listProdutos: IProdutos[] = [];
  public bgStyle: any;
  public formEsteira: FormGroup;
  public innerWidth: number;
  public filtroPesquisaAvancada = FiltroPesquisaAvancada;
  public seletorPeculiaridadesCatalogos: SeletorPeculiaridadesCatalogos;

  // Constructor
  constructor(
    private readonly globalService: GlobalService,
    private readonly tenantService: TenantService,
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
    this.initializeComponent();
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.setupInitialState();
    this.setupRouterEvents();
    this.forceEnableScroll(); // Garantir que o scroll funcione no mobile
  }

  // Event listeners
  @HostListener('document:keydown', ['$event']) 
  onKeydownHandler(event: KeyboardEvent): void {
    if (this.hasNoProducts() && this.isEnterKey(event)) {
      this.handleEnterKeyPress(event);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    // Garantir que o scroll continue funcionando
    this.forceEnableScroll();
  }

  // Public methods
  public buscaProdutosPorDescricao(): void {
    this.setSpinner(true);
    
    this.globalService
    .getProdutosPesquisa(this.getSearchData())
    .pipe(take(1))
    .subscribe({
      next: (data: any) => this.handleSearchResponse(data),
      error: (error) => this.handleSearchError(error),
      complete: () => this.setSpinner(false),
    });
  }

  public openModalPesquisaAvancada(): void {
    const modalData: ModalData = { filtro: this.filtroPesquisaAvancada };
    const dialogRef = this.dialog.open(ModalPesquisaAvancadaComponent, {
      width: '90vw',
      maxWidth: '548px',
      data: modalData
    });

    dialogRef.afterClosed().subscribe((result: AdvancedSearchResult) => {
      if (result) {
        this.handleAdvancedSearchResult(result);
      }
    });
  }

  public openModalFiltro(): void {
    const modalData: ModalData = { width: '200px' };
    const dialogRef = this.dialog.open(FiltroProdutosComponent, {
      data: modalData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.descricao = result.code;
        this.buscaProdutosPorDescricao();
      }
    });
  }

  public goTo(event: PageChangedEvent): void {
    this.formEsteira.get('page')?.setValue(event.page);
    this.buscaProdutosPorDescricao();
  }

  public limpar(): void {
    this.listProdutos = [];
    this.formEsteira = Formularios.geraFormulario(new PesquisaEsteiraClass());
    this.controlarScroll();
  }

  public reloadCatalog(): void {
    // Recarregar o catálogo do início
    this.limpar();
    this.buscaProdutosPorDescricao();
  }

  // Private methods
  private initializeComponent(): void {
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(this.tenantService);
    this.bgStyle = this.authStorageService.getDataStorage().planoFundo;
  }

  private setupInitialState(): void {
    this.habilitaPlanoFundo();
    this.innerWidth = window.innerWidth;
    this.authStorageService.setTitlePage(APP_CONSTANTS.TITLES.INICIO);
    this.formEsteira = Formularios.geraFormulario(new PesquisaEsteiraClass());
    this.controlarScroll();
  }

  private setupRouterEvents(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.limpar();
      }
    });
  }

  private controlarScroll(): void {
    // Sempre permitir scroll, removendo a classe no-scroll
    document.body.classList.remove(APP_CONSTANTS.CSS_CLASSES.NO_SCROLL);
  }

  private habilitaPlanoFundo(): void {
    this.seletorPeculiaridadesCatalogos.getTenant();
  }

  private getSearchData(): FiltroPesquisarProdutos {
    const trimmedDescription = this.descricao?.trim() ?? '';
    const upperCaseDescription = trimmedDescription.toUpperCase();

    return new FiltroPesquisarProdutos({
      code: upperCaseDescription,
      description: upperCaseDescription,
      page: +this.formEsteira.get('page')?.value || 1
    });
  }

  private handleSearchResponse(data: SearchResponse): void {
    if (data) {
      this.listProdutos = data.produtos;
      this.formEsteira.get('totalPages')?.setValue(data.totalPaginas);
      this.controlarScroll();
      
      if (data.produtos.length <= 0) {
        Toaster.Warning(APP_CONSTANTS.MESSAGES.NO_PRODUCTS_FOUND);
      }
    } else {
      Toaster.Warning(APP_CONSTANTS.MESSAGES.NO_PRODUCTS_FOUND);
    }
  }

  private handleSearchError(error: any): void {
    Toaster.Error(APP_CONSTANTS.MESSAGES.SEARCH_ERROR);
    this.setSpinner(false);
  }

  private handleAdvancedSearchResult(result: AdvancedSearchResult): void {
    if (result.produtos) {
      this.listProdutos = result.produtos;
      this.formEsteira.get('totalPages')?.setValue(result.totalPaginas);
      this.controlarScroll();
    }
    
    if (result.filtro?.flag) {
      Object.assign(this.filtroPesquisaAvancada, result.filtro);
    } else {
      this.filtroPesquisaAvancada.flag = false;
    }
  }

  private hasNoProducts(): boolean {
    return this.listProdutos.length <= 0;
  }

  private isEnterKey(event: KeyboardEvent): boolean {
    return event.code === KeyboardKey.Enter || event.code === KeyboardKey.EnterNumpad;
  }

  private handleEnterKeyPress(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.id === APP_CONSTANTS.FORM_IDS.SEARCH_INPUT) {
      this.buscaProdutosPorDescricao();
    }
  }

  private setSpinner(value: boolean): void {
    this.spinner = value;
  }

  public forceEnableScroll(): void {
    // Forçar habilitação do scroll no mobile
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    
    // Remover qualquer classe que possa estar bloqueando o scroll
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll');
  }

  // Método para lidar com mudanças na pesquisa
  public onSearchChanged(filtro: FiltroPesquisarProdutos): void {
    this.descricao = filtro.code;
    this.buscaProdutosPorDescricao();
  }

  // Método para lidar com atualizações dos produtos
  public onProductsUpdated(produtos: IProdutos[]): void {
    this.listProdutos = produtos;
  }

  // Método para lidar quando não há produtos encontrados
  public onNoProductsFound(message: string): void {
    Toaster.Warning(message);
  }
}


