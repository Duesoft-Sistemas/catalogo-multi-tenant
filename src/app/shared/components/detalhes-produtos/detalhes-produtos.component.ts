import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProdutos } from '../../interface/IProdutos';
import { ImageService } from '../../services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalhes-produtos',
  templateUrl: './detalhes-produtos.component.html',
  styleUrls: ['./detalhes-produtos.component.css'],
})
export class DetalhesProdutosComponent implements OnInit {
  produto!: IProdutos;
  imgPadraoProduto = '../../../assets/images/imagem_nao_encontrada.jpg';
  imgPadraoMarca = '../../../assets/images/sem_foto.png';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) {
    // Verificar se data e data.detalhes existem
    if (data && data.detalhes) {
      this.produto = data.detalhes;
    } else if (data) {
      // Se não tem data.detalhes, usar data diretamente
      this.produto = data;
    } else {
      // Fallback para produto vazio
      this.produto = {} as IProdutos;
    }

    // Verificar se produto existe antes de acessar suas propriedades
    if (this.produto) {
      if (this.produto.completeDescription == '')
        this.produto.completeDescription = null;
      if (this.produto.observations == '') this.produto.observations = null;

      // Log das propriedades específicas das tabs
      if (this.produto.images && this.produto.images.length > 0) {
        this.produto.images.forEach((imagem) => {
          imagem.caminhoSafe = this.imageService.sanitizeImageUrl(
            imagem.caminho
          );
        });
      }
    }
  }

  ngOnInit() {
    // Prevenir conflitos com scroll
    this.prevenirConflitosScroll();
  }

  private prevenirConflitosScroll() {
    // Adicionar listener para detectar mudanças no carousel
    setTimeout(() => {
      const carousel = document.querySelector('carousel');
      if (carousel) {
        carousel.addEventListener('slide.bs.carousel', (event: any) => {
          console.log('Carousel slide mudou:', event);
        });
      }
    }, 100);
  }

  onMarcaImageError(event: any) {
    this.imageService.handleImageError(event, this.imgPadraoMarca);
  }

  onCarouselImageError(event: any, item: any) {
    console.log('Erro ao carregar imagem no carousel:', item.caminho);
    console.log('Evento de erro:', event);
    
    // Verificar se a imagem já carregou com sucesso antes
    if (item.carregadaComSucesso) {
      console.log('Imagem já carregou com sucesso, ignorando erro');
      return;
    }
    
    // Verificar se já tentamos carregar esta imagem antes
    if (item.tentativaCarregamento) {
      console.log('Já tentamos carregar esta imagem, aplicando fallback');
      this.imageService.handleImageError(event, this.imgPadraoProduto);
      item.caminhoSafe = this.imageService.sanitizeImageUrl(
        this.imgPadraoProduto
      );
      return;
    }
    
    // Marcar que já tentamos carregar
    item.tentativaCarregamento = true;
    
    // Tentar carregar a imagem diretamente para testar
    this.testarImagemDiretamente(item);
  }

  testarImagemDiretamente(item: any) {
    console.log('Testando imagem diretamente:', item.caminho);
    
    const img = new Image();
    img.onload = () => {
      console.log('Imagem carregou no teste direto:', item.caminho);
      // Marcar como carregada com sucesso
      item.carregadaComSucesso = true;
      // Não modificar o caminhoSafe aqui, deixar o template usar item.caminho
    };
    
    img.onerror = () => {
      console.log('Imagem falhou no teste direto, aplicando fallback:', item.caminho);
      // Aplicar fallback apenas se realmente falhou
      item.caminho = this.imgPadraoProduto;
      item.carregadaComSucesso = false;
    };
    
    img.src = item.caminho;
  }

  onImageLoad(item: any) {
    console.log('Imagem carregada com sucesso:', item.caminho);
    // Marcar que a imagem carregou com sucesso
    item.carregadaComSucesso = true;
  }

  trackByImage(index: number, item: any): any {
    return item.caminho || index;
  }

  getPrice(price: any): number {
    if (!price) return 0;
    return price.replace(',', '.') as number;
  }

  // Métodos auxiliares para verificar se as tabs devem estar habilitadas
  hasApplications(): boolean {
    return this.produto?.applications && this.produto.applications.length > 0;
  }

  hasSimilar(): boolean {
    return this.produto?.similar && this.produto.similar.length > 0;
  }

  hasImages(): boolean {
    return this.produto?.images && this.produto.images.length > 0;
  }

  // Método para carregar dados de teste
  loadTestData(): void {
    // Dados de teste para applications
    this.produto.applications = [
      { description: 'Aplicação de teste 1 - Motor 1.0' },
      { description: 'Aplicação de teste 2 - Motor 1.6' },
      { description: 'Aplicação de teste 3 - Motor 2.0' },
    ];

    // Dados de teste para similar
    this.produto.similar = [
      {
        id: 1,
        code: 'SIM001',
        description: 'Produto Similar 1',
        price: '10,50',
        stock: 5,
        image: this.imgPadraoProduto,
        imageSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto),
      } as IProdutos,
      {
        id: 2,
        code: 'SIM002',
        description: 'Produto Similar 2',
        price: '15,75',
        stock: 3,
        image: this.imgPadraoProduto,
        imageSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto),
      } as IProdutos,
    ];

    // Dados de teste para images
    this.produto.images = [
      {
        caminho: this.imgPadraoProduto,
        caminhoSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto),
      },
      {
        caminho: this.imgPadraoProduto,
        caminhoSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto),
      },
    ];

    // Dados de teste para originalCodes
    this.produto.originalCodes = [
      { originalCode: 'ORIG001' },
      { originalCode: 'ORIG002' },
      { originalCode: 'ORIG003' },
    ];
  }

  // Método para recarregar o catálogo (não aplicável neste contexto)
  reloadCatalog(): void {
    // No contexto de detalhes de produto, não há necessidade de recarregar
    // Este método é mantido apenas para compatibilidade
  }
}
