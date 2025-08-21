import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Toaster } from '../../functions/toaster';
import { IProdutos } from '../../interface/IProdutos';
import { GlobalService } from '../../services/global.service';
import { ImageService } from '../../services/image.service';
import { AdicionarCarrinhoComponent } from '../adicionar-carrinho/adicionar-carrinho.component';
import { DetalhesProdutosComponent } from '../detalhes-produtos/detalhes-produtos.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FiltroPesquisarProdutos } from '../../classes/filtro-pesquisar-produtos';
import { FiltroProdutosComponent } from '../filtro-produtos/filtro-produtos.component';
import { ModalPesquisaAvancadaComponent } from '../../../pages/iniciar/modal-pesquisa-avancada/modal-pesquisa-avancada.component';
import { FiltroPesquisaAvancada } from '../../../pages/iniciar/modal-pesquisa-avancada/filtro-pesquisa-avancada';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css'],
})
export class ListaProdutosComponent implements OnInit {
  imgPadraoProduto = '../../../assets/images/imagem_nao_encontrada.jpg';
  imgPadraoMarca = '../../../assets/images/sem_foto.png';

  maxSizePaginator = 5;
  spinner = false;
  toogleClick = false;
  carregandoDetalhes = false; // Indicador de carregamento dos detalhes
  carregandoCarrinho = false; // Indicador de carregamento do carrinho
  currentPage = 1; // Página atual
  
  // Mapas para controlar carregamento individual por produto
  carregandoDetalhesPorProduto = new Map<number, boolean>();
  carregandoCarrinhoPorProduto = new Map<number, boolean>();

  // Propriedades para pesquisa e filtros
  termoPesquisa = '';
  ordenacaoSelecionada = '';
  modelo = new FiltroPesquisarProdutos();
  filtroPesquisaAvancada = FiltroPesquisaAvancada;
  private searchTimeout: any;
  private produtosOriginais: IProdutos[] = []; // Lista original para restaurar quando necessário

  
  // Propriedades para mensagens de produtos não encontrados
  mensagemSemProdutos = 'Nenhum produto encontrado';
  descricaoSemProdutos = 'Tente ajustar os filtros ou termos de pesquisa';

  private _listProdutos: IProdutos[] = [];
  @Input() 
  set listProdutos(value: IProdutos[]) {
    this._listProdutos = value || [];
    // Atualizar lista original quando novos produtos forem carregados
    this.produtosOriginais = [...this._listProdutos];
    
    // Processar imagens dos novos produtos
    this._listProdutos.forEach((produto)=>{
      produto.imageSafe = this.imageService.sanitizeImageUrl(produto.image);
    });
    
    // Carregar detalhes se houver produtos e não estiver carregando
    if (this._listProdutos.length > 0 && !this.carregandoDetalhes) {
      this.carregarDetalhesProdutos();
    }
  }
  get listProdutos(): IProdutos[] {
    return this._listProdutos;
  }
  
  @Input() totalPaginas: number;
  @Input() detalhes?: boolean;
  @Input() enableSearch = true; // Habilita/desabilita a funcionalidade de pesquisa
  @Output() pageChanged = new EventEmitter();
  @Output() searchChanged = new EventEmitter<FiltroPesquisarProdutos>();
  @Output() productsUpdated = new EventEmitter<IProdutos[]>();
  @Output() noProductsFound = new EventEmitter<string>(); // Emitir quando não há produtos
  @Output() reloadCatalog = new EventEmitter<void>(); // Emitir para recarregar catálogo

  // Input para página atual com setter
  private _currentPageInput?: number;
  @Input() 
  set currentPageInput(value: number | undefined) {
    this._currentPageInput = value;
    if (value && value >= 1) {
      this.currentPage = value;
    }
  }
  get currentPageInput(): number | undefined {
    return this._currentPageInput;
  }

  constructor(
    public dialog: MatDialog, 
    private service: GlobalService, 
    public sanitizer: DomSanitizer,
    private imageService: ImageService
  ) {
    this.maxSizePaginator = window.innerWidth > 575 ? 5 : 1;
  }

  ngOnInit() {
    // Garantir que listProdutos seja um array
    if (!this.listProdutos) {
      this.listProdutos = [];
    }
    
    // Resetar para primeira página quando os dados mudarem
    this.currentPage = 1;
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  // Função para carregar detalhes de todos os produtos
  private carregarDetalhesProdutos(): void {
    this.carregandoDetalhes = true;
    let produtosCarregados = 0;
    
    this.listProdutos.forEach((produto, index) => {
      // Pequeno delay para não sobrecarregar a API
      setTimeout(() => {
        this.service
          .getDetalhesProduto(produto.id)
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              if (data) {
                // Atualizar dados básicos
                produto.stock = data.stock;
                produto.stockStatus = data.stockStatus;
                
                // Atualizar propriedades das tabs se disponíveis
                if (data.applications) produto.applications = data.applications;
                if (data.similar) produto.similar = data.similar;
                if (data.images) produto.images = data.images;
                if (data.originalCodes) produto.originalCodes = data.originalCodes;
                if (data.completeDescription) produto.completeDescription = data.completeDescription;
                if (data.observations) produto.observations = data.observations;
              }
              
              produtosCarregados++;
              if (produtosCarregados === this.listProdutos.length) {
                this.carregandoDetalhes = false;
                // Atualizar lista original após carregar todos os detalhes
                this.produtosOriginais = [...this.listProdutos];
                // Emitir atualização dos produtos para refletir mudanças na UI
                this.productsUpdated.emit([...this.listProdutos]);
              }
            },
            error: (error) => {
              console.error(`Erro ao carregar detalhes do produto ${produto.code}:`, error);
              produtosCarregados++;
              if (produtosCarregados === this.listProdutos.length) {
                this.carregandoDetalhes = false;
                // Atualizar lista original após carregar todos os detalhes
                this.produtosOriginais = [...this.listProdutos];
                // Emitir atualização dos produtos para refletir mudanças na UI
                this.productsUpdated.emit([...this.listProdutos]);
              }
            }
          });
      }, index * 100); // Delay de 100ms entre cada requisição
    });
  }

  // Função para realizar pesquisa
  realizarPesquisa(): void {
    if (!this.enableSearch) return;

    const termoLimpo = this.termoPesquisa?.trim() ?? '';
    
    // Se o termo estiver vazio, limpar filtros e mostrar todos os produtos
    if (termoLimpo === '') {
      this.modelo = new FiltroPesquisarProdutos({
        code: '',
        description: '',
        page: 1
      });
      this.searchChanged.emit(this.modelo);
      return;
    }

    this.modelo = new FiltroPesquisarProdutos({
      code: termoLimpo.toUpperCase(),
      description: termoLimpo.toUpperCase(),
      page: 1
    });

    this.searchChanged.emit(this.modelo);
  }

  // Função para abrir modal de filtros básicos
  openModalFiltro(): void {
    if (!this.enableSearch) return;

    const dialogRef = this.dialog.open(FiltroProdutosComponent, {
      data: { width: '200px' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.modelo = new FiltroPesquisarProdutos(result);
        this.searchChanged.emit(this.modelo);
      }
    });
  }

  // Função para abrir modal de pesquisa avançada
  openModalPesquisaAvancada(): void {
    if (!this.enableSearch) return;

    const dialogRef = this.dialog.open(ModalPesquisaAvancadaComponent, {
      width: '90vw',
      maxWidth: '548px',
      data: { filtro: this.filtroPesquisaAvancada }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.produtos) {
          this.listProdutos = result.produtos;
          this.totalPaginas = result.totalPaginas;
          this.productsUpdated.emit(this.listProdutos);
          
          // Atualizar lista original com os novos produtos
          this.produtosOriginais = [...this.listProdutos];
          
          this.listProdutos.forEach((produto) => {
            if (produto.image != './static/img/imagem_nao_encontrada.jpg') {
              produto.imageSafe = this.sanitizer.bypassSecurityTrustUrl(produto.image);
            }
          });
        }
        if (result.filtro?.flag) {
          this.filtroPesquisaAvancada = result.filtro;
        } else {
          this.filtroPesquisaAvancada.flag = false;
        }
      }
    });
  }

  // Função para ordenar produtos
  ordenarProdutos(): void {
    if (!this.ordenacaoSelecionada) {
      // Se nenhuma ordenação estiver selecionada, restaurar lista original
      this.listProdutos = [...this.produtosOriginais];
      this.productsUpdated.emit(this.listProdutos);
      return;
    }

    let produtosOrdenados = [...this.produtosOriginais]; // Usar lista original como base

    switch (this.ordenacaoSelecionada) {
      case 'featured':
        // Manter ordem original (destaques)
        break;
      case 'price-asc':
        produtosOrdenados.sort((a, b) => this.getPrice(a.price) - this.getPrice(b.price));
        break;
      case 'price-desc':
        produtosOrdenados.sort((a, b) => this.getPrice(b.price) - this.getPrice(a.price));
        break;
      case 'name-asc':
        produtosOrdenados.sort((a, b) => this.getProductName(a).localeCompare(this.getProductName(b)));
        break;
      case 'name-desc':
        produtosOrdenados.sort((a, b) => this.getProductName(b).localeCompare(this.getProductName(a)));
        break;
      case 'stock-only':
        // Filtrar produtos com estoque da lista atual
        const produtosComEstoque = produtosOrdenados.filter(produto => this.hasStock(produto));
        produtosOrdenados = produtosComEstoque;
        break;
    }

    this.listProdutos = produtosOrdenados;
    this.productsUpdated.emit(this.listProdutos);
    
    // Verificar se há produtos após a filtragem
    if (this.listProdutos.length === 0) {
      this.definirMensagemSemProdutos();
      this.noProductsFound.emit(this.mensagemSemProdutos);
    }
  }

  // Método para atualizar a lista original quando necessário
  private atualizarListaOriginal(): void {
    this.produtosOriginais = [...this.listProdutos];
  }



  // Método para definir mensagens específicas baseadas no filtro
  private definirMensagemSemProdutos(): void {
    switch (this.ordenacaoSelecionada) {
      case 'stock-only':
        this.mensagemSemProdutos = 'Nenhum produto com estoque encontrado';
        this.descricaoSemProdutos = 'Todos os produtos estão sem estoque no momento. Tente outros filtros ou volte mais tarde.';
        break;
      case 'price-asc':
      case 'price-desc':
        this.mensagemSemProdutos = 'Nenhum produto encontrado para ordenação por preço';
        this.descricaoSemProdutos = 'Tente usar outros filtros ou verificar se há produtos disponíveis.';
        break;
      case 'name-asc':
      case 'name-desc':
        this.mensagemSemProdutos = 'Nenhum produto encontrado para ordenação por nome';
        this.descricaoSemProdutos = 'Tente usar outros filtros ou verificar se há produtos disponíveis.';
        break;
      default:
        this.mensagemSemProdutos = 'Nenhum produto encontrado';
        this.descricaoSemProdutos = 'Tente ajustar os filtros ou termos de pesquisa';
        break;
    }
  }





  // Função para lidar com tecla Enter na pesquisa
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.realizarPesquisa();
    }
  }

  // Função para lidar com mudanças no input de pesquisa
  onSearchInput(event: any): void {
    const value = event.target.value?.trim() ?? '';
    
    // Limpar timeout anterior se existir
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Se o input estiver vazio, limpar filtros automaticamente
    if (value === '') {
      this.realizarPesquisa();
    } else {
      // Se houver texto, aguardar 500ms antes de pesquisar
      this.searchTimeout = setTimeout(() => {
        this.realizarPesquisa();
      }, 500);
    }
  }

  // Função para lidar com mudança na ordenação
  onOrdenacaoChange(): void {
    // Sempre executar a ordenação, mesmo se já estiver aplicada
    this.ordenarProdutos();
  }

  // Função para cancelar a ordenação selecionada
  cancelarOrdenacao(): void {
    // Limpar a seleção e recarregar catálogo
    this.ordenacaoSelecionada = '';
    this.reloadCatalog.emit();
  }

  onImageError(event: any, produto: IProdutos) {
    this.imageService.handleImageError(event);
    produto.imageSafe = this.imageService.sanitizeImageUrl(this.imgPadraoProduto);
  }

  getPrice(price: any): number {
    return price.toString()?.replace(',', '.') as number;
  }

  // Função para obter o nome do produto
  getProductName(produto: IProdutos): string {
    // Se já existe a propriedade name, usar ela
    if (produto.name) {
      return produto.name;
    }
    
    // Se não existe, usar a descrição do produto (mais apropriado que o código)
    if (produto.description) {
      return produto.description;
    }
    
    // Se não tem descrição, usar o código como fallback
    if (produto.code) {
      return produto.code;
    }
    
    // Se não tem nada, usar "Produto"
    return 'Produto';
  }

  // Função para converter estoque para número de forma segura
  getStockNumber(produto: IProdutos): number {
    if (produto.stock === null || produto.stock === undefined) {
      return 0;
    }
    const stockNumber = Number(produto.stock);
    return stockNumber;
  }

  // Função para verificar se o produto tem estoque
  hasStock(produto: IProdutos): boolean {
    // Debug: log para todos os produtos
    console.log(`Verificando estoque do produto ${produto.code}: Stock=${produto.stock}, Tipo=${typeof produto.stock}`);
    
    // Se o produto não tem dados de estoque, considerar como disponível (fallback)
    // Isso evita que produtos sejam ocultados por falta de dados da API
    if (!produto || produto.stock === null || produto.stock === undefined) {
      console.log(`Produto ${produto.code}: Sem dados de estoque, considerando como disponível`);
      return true;
    }
    
    // Se o stock é uma string, tentar converter
    if (typeof produto.stock === 'string') {
      const stockStr = produto.stock.trim().toLowerCase();
      
      // Se contém palavras que indicam disponibilidade
      if (stockStr.includes('disponível') || stockStr.includes('sim') || stockStr.includes('yes')) {
        console.log(`Produto ${produto.code}: String indica disponibilidade`);
        return true;
      }
      
      // Se contém palavras que indicam indisponibilidade
      if (stockStr.includes('indisponível') || stockStr.includes('não') || stockStr.includes('no') || stockStr.includes('sem')) {
        console.log(`Produto ${produto.code}: String indica indisponibilidade`);
        return false;
      }
      
      // Se é uma string numérica, converter e verificar
      const parsed = parseFloat(stockStr);
      if (!isNaN(parsed)) {
        const result = parsed > 0;
        console.log(`Produto ${produto.code}: String numérica ${parsed}, resultado: ${result}`);
        return result;
      }
    }
    
    const stockNumber = this.getStockNumber(produto);
    const result = stockNumber > 0;
    console.log(`Produto ${produto.code}: Número ${stockNumber}, resultado: ${result}`);
    return result;
  }

  // Função para verificar se o produto está sem estoque
  isOutOfStock(produto: IProdutos): boolean {
    const hasStockResult = this.hasStock(produto);
    const isOutOfStockResult = !hasStockResult;
    
    // Debug: log para produtos sem estoque
    if (isOutOfStockResult) {
      console.log(`Produto ${produto.code} está sem estoque. Stock: ${produto.stock}, Tipo: ${typeof produto.stock}`);
    }
    
    return isOutOfStockResult;
  }

  openDetalhes(dados: IProdutos) {
    const dialogRef = this.dialog.open(DetalhesProdutosComponent, {
      width: '90%',
      maxWidth: '800px',
      data: { detalhes: dados },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openAdicionarCarrinho(result);
      }
    });
  }

  openAdicionarCarrinho(dados: IProdutos) {
    try {
      const dialogRef = this.dialog.open(AdicionarCarrinhoComponent, {
        width: '90%',
        maxWidth: '600px',
        data: dados,
        disableClose: false,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          Toaster.Success('Produto adicionado ao carrinho!');
        }
      });
    } catch (error) {
      console.error('Erro ao abrir modal:', error);
      Toaster.Error('Erro ao abrir modal de adicionar produto');
    }
  }

  // Função para abrir detalhes do produto
  abrirDetalhes(produto: IProdutos): void {
    if (this.carregandoDetalhesPorProduto.get(produto.id)) {
      console.log(`Detalhes já estão sendo carregados para ${produto.code}, aguarde...`);
      return;
    }

    console.log(`Carregando detalhes para ${produto.code} - DETALHES`);
    this.carregandoDetalhesPorProduto.set(produto.id, true);

    this.service
      .getDetalhesProduto(produto.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            // Atualizar dados do produto com os detalhes
            produto.stock = data.stock;
            produto.stockStatus = data.stockStatus;
            produto.price = data.price;
            produto.price2 = data.price2;
            produto.unity = data.unity;
            produto.unity2 = data.unity2;
            produto.description = data.description;
            produto.productGroup = data.productGroup;
            produto.productSubgroup = data.productSubgroup;
            produto.emPromocao = data.emPromocao;
            
            // Atualizar propriedades específicas das tabs
            produto.applications = data.applications || [];
            produto.similar = data.similar || [];
            produto.images = data.images || [];
            produto.originalCodes = data.originalCodes || [];
            produto.completeDescription = data.completeDescription;
            produto.observations = data.observations;

            console.log(`Detalhes carregados para ${produto.code}:`, data);
            console.log(`Applications: ${produto.applications?.length || 0}`);
            console.log(`Similar: ${produto.similar?.length || 0}`);
            console.log(`Images: ${produto.images?.length || 0}`);
            
            // Emitir atualização dos produtos para refletir mudanças na UI
            this.productsUpdated.emit([...this.listProdutos]);
            
            this.openDetalhes(produto);
          } else {
            Toaster.Warning('Erro ao carregar detalhes do produto.');
          }
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes:', error);
          Toaster.Error('Erro ao carregar detalhes do produto.');
        },
        complete: () => {
          this.carregandoDetalhesPorProduto.set(produto.id, false);
        }
      });
  }

  // Função para adicionar produto ao carrinho
  adicionarAoCarrinho(produto: IProdutos): void {
    if (this.carregandoCarrinhoPorProduto.get(produto.id)) {
      console.log(`Carrinho já está sendo carregado para ${produto.code}, aguarde...`);
      return;
    }

    this.carregandoCarrinhoPorProduto.set(produto.id, true);

    // Verificar se o produto já tem os dados necessários
    if (produto.stock !== undefined && produto.price !== undefined) {
      // Se já tem os dados, abrir o modal diretamente
      this.openAdicionarCarrinho(produto);
      this.carregandoCarrinhoPorProduto.set(produto.id, false);
    } else {
      // Se não tem os dados, carregar os detalhes primeiro
      this.service
        .getDetalhesProduto(produto.id)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            if (data) {
              // Atualizar dados do produto com os detalhes
              produto.stock = data.stock;
              produto.stockStatus = data.stockStatus;
              produto.price = data.price;
              produto.price2 = data.price2;
              produto.unity = data.unity;
              produto.unity2 = data.unity2;
              produto.description = data.description;
              produto.productGroup = data.productGroup;
              produto.productSubgroup = data.productSubgroup;
              produto.emPromocao = data.emPromocao;
              
              // Atualizar propriedades específicas das tabs
              produto.applications = data.applications || [];
              produto.similar = data.similar || [];
              produto.images = data.images || [];
              produto.originalCodes = data.originalCodes || [];
              produto.completeDescription = data.completeDescription;
              produto.observations = data.observations;

              // Emitir atualização dos produtos para refletir mudanças na UI
              this.productsUpdated.emit([...this.listProdutos]);

              this.openAdicionarCarrinho(produto);
            } else {
              Toaster.Warning('Erro ao carregar detalhes do produto.');
            }
          },
          error: (error) => {
            console.error('Erro ao carregar detalhes:', error);
            Toaster.Error('Erro ao carregar detalhes do produto.');
          },
          complete: () => {
            this.carregandoCarrinhoPorProduto.set(produto.id, false);
          }
        });
    }
  }

  // Funções auxiliares para verificar carregamento por produto
  isCarregandoDetalhes(produto: IProdutos): boolean {
    return this.carregandoDetalhesPorProduto.get(produto.id) || false;
  }

  isCarregandoCarrinho(produto: IProdutos): boolean {
    return this.carregandoCarrinhoPorProduto.get(produto.id) || false;
  }

  // Função antiga mantida para compatibilidade
  getDetalhes(produto: IProdutos, tipo: string): void {
    if (tipo === 'D') {
      this.abrirDetalhes(produto);
    } else if (tipo === 'C') {
      this.adicionarAoCarrinho(produto);
    }
  }

  ngOnDestroy(): void {
    // Limpar timeout se existir
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Remover listener de redimensionamento
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  // Método para lidar com redimensionamento da janela
  private onWindowResize(): void {
    // Forçar re-renderização da paginação quando a tela for redimensionada
    // Isso garante que o número correto de páginas seja exibido
    setTimeout(() => {
      // Trigger change detection
      this.getVisiblePages();
    }, 100);
  }

  // Método para verificar se a tela é muito pequena
  isVerySmallScreen(): boolean {
    return window.innerWidth <= 480;
  }

  // Método para navegar para uma página específica
  goToPage(page: number | string): void {
    // Converter para número se for string
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    
    if (pageNumber >= 1 && pageNumber <= this.totalPaginas && pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this.pageChanged.emit({ page: pageNumber });
    }
  }

  // Método para obter as páginas visíveis com limite responsivo
  getVisiblePages(): (number | string)[] {
    if (!this.totalPaginas) return [];

    // Determinar o número máximo de páginas visíveis baseado no tamanho da tela
    const isMobile = window.innerWidth <= 640;
    const isSmallMobile = window.innerWidth <= 480;
    
    let maxVisiblePages = 5; // Padrão para desktop
    
    if (isSmallMobile) {
      maxVisiblePages = 3; // Apenas 3 páginas para telas muito pequenas
    } else if (isMobile) {
      maxVisiblePages = 4; // 4 páginas para mobile
    }
    
    const pages: (number | string)[] = [];
    
    if (this.totalPaginas <= maxVisiblePages) {
      // Se temos páginas suficientes ou menos, mostrar todas
      for (let i = 1; i <= this.totalPaginas; i++) {
        pages.push(i);
      }
    } else {
      // Se temos mais páginas, mostrar uma janela responsiva
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPaginas, startPage + maxVisiblePages - 1);
      
      // Ajustar se chegamos ao final
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Adicionar elipsis inicial se necessário (apenas se não for mobile muito pequeno)
      if (startPage > 1 && !isSmallMobile) {
        pages.push('start-ellipsis');
      }
      
      // Adicionar páginas numeradas
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Adicionar elipsis final se necessário (apenas se não for mobile muito pequeno)
      if (endPage < this.totalPaginas && !isSmallMobile) {
        pages.push('end-ellipsis');
      }
    }
    
    return pages;
  }
}
