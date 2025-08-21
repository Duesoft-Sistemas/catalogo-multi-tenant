import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProdutos } from '../../interface/IProdutos';
import { ImageService } from '../../services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalhes-produtos',
  templateUrl: './detalhes-produtos.component.html',
  styleUrls: ['./detalhes-produtos.component.css']
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
    console.log('DetalhesProdutosComponent - Data recebida:', data);
    
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

    console.log('DetalhesProdutosComponent - Produto processado:', this.produto);

    // Verificar se produto existe antes de acessar suas propriedades
    if (this.produto) {
      if(this.produto.completeDescription == '')
          this.produto.completeDescription = null;
      if(this.produto.observations == '')
          this.produto.observations = null;
      
      // Log das propriedades específicas das tabs
      console.log('DetalhesProdutosComponent - Applications:', this.produto.applications);
      console.log('DetalhesProdutosComponent - Similar:', this.produto.similar);
      console.log('DetalhesProdutosComponent - Images:', this.produto.images);
      console.log('DetalhesProdutosComponent - OriginalCodes:', this.produto.originalCodes);
      
      if(this.produto.images && this.produto.images.length > 0) {
        this.produto.images.forEach((imagem)=>{
          imagem.caminhoSafe = this.imageService.sanitizeImageUrl(imagem.caminho);
        });
      }
    }
  }

  ngOnInit() {
    console.log('DetalhesProdutosComponent - ngOnInit - Produto final:', this.produto);
  }

  onMarcaImageError(event: any) {
    this.imageService.handleImageError(event, this.imgPadraoMarca);
  }

  onCarouselImageError(event: any, item: any) {
    this.imageService.handleImageError(event, this.imgPadraoProduto);
    item.caminhoSafe = this.imageService.sanitizeImageUrl(this.imgPadraoProduto);
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
    console.log('Carregando dados de teste...');
    
    // Dados de teste para applications
    this.produto.applications = [
      { description: 'Aplicação de teste 1 - Motor 1.0' },
      { description: 'Aplicação de teste 2 - Motor 1.6' },
      { description: 'Aplicação de teste 3 - Motor 2.0' }
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
        imageSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto)
      } as IProdutos,
      {
        id: 2,
        code: 'SIM002',
        description: 'Produto Similar 2',
        price: '15,75',
        stock: 3,
        image: this.imgPadraoProduto,
        imageSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto)
      } as IProdutos
    ];

    // Dados de teste para images
    this.produto.images = [
      {
        caminho: this.imgPadraoProduto,
        caminhoSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto)
      },
      {
        caminho: this.imgPadraoProduto,
        caminhoSafe: this.imageService.sanitizeImageUrl(this.imgPadraoProduto)
      }
    ];

    // Dados de teste para originalCodes
    this.produto.originalCodes = [
      { originalCode: 'ORIG001' },
      { originalCode: 'ORIG002' },
      { originalCode: 'ORIG003' }
    ];

    console.log('Dados de teste carregados:', {
      applications: this.produto.applications,
      similar: this.produto.similar,
      images: this.produto.images,
      originalCodes: this.produto.originalCodes
    });
  }

  // Método para recarregar o catálogo (não aplicável neste contexto)
  reloadCatalog(): void {
    // No contexto de detalhes de produto, não há necessidade de recarregar
    // Este método é mantido apenas para compatibilidade
    console.log('reloadCatalog chamado em detalhes-produtos - não aplicável');
  }
}
