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
    this.produto = data.detalhes;

    if(this.produto.completeDescription == '')
        this.produto.completeDescription = null;
    if(this.produto.observations == '')
        this.produto.observations = null;
    if(this.produto.images.length > 0)
    this.produto.images.forEach((imagem)=>{
      imagem.caminhoSafe = this.imageService.sanitizeImageUrl(imagem.caminho);
    })
  }

  ngOnInit() {
  }

  onMarcaImageError(event: any) {
    this.imageService.handleImageError(event, this.imgPadraoMarca);
  }

  onCarouselImageError(event: any, item: any) {
    this.imageService.handleImageError(event, this.imgPadraoProduto);
    item.caminhoSafe = this.imageService.sanitizeImageUrl(this.imgPadraoProduto);
  }

  getPrice(price: any): number {
    return price.replace(',', '.') as number;
  }
}
