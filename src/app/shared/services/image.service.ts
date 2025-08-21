import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly IMAGE_NOT_FOUND = '../../../assets/images/imagem_nao_encontrada.jpg';
  private readonly BRAND_NOT_FOUND = '../../../assets/images/sem_foto.png';

  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Sanitiza uma URL de imagem e retorna um SafeUrl
   */
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (!imageUrl || this.isInvalidImage(imageUrl)) {
      return this.sanitizer.bypassSecurityTrustUrl(this.IMAGE_NOT_FOUND);
    }
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  /**
   * Sanitiza uma URL de marca e retorna um SafeUrl
   */
  sanitizeBrandUrl(brandUrl: string): SafeUrl {
    if (!brandUrl || this.isInvalidBrand(brandUrl)) {
      return this.sanitizer.bypassSecurityTrustUrl(this.BRAND_NOT_FOUND);
    }
    return this.sanitizer.bypassSecurityTrustUrl(brandUrl);
  }

  /**
   * Verifica se uma imagem é inválida
   */
  isInvalidImage(imageUrl: string): boolean {
    return !imageUrl || 
           imageUrl.includes('imagem_nao_encontrada.jpg') || 
           imageUrl === './static/img/imagem_nao_encontrada.jpg' ||
           imageUrl.trim() === '';
  }

  /**
   * Verifica se uma marca é inválida
   */
  isInvalidBrand(brandUrl: string): boolean {
    return !brandUrl || 
           brandUrl.includes('./static/') || 
           brandUrl.trim() === '';
  }

  /**
   * Retorna a URL da imagem padrão
   */
  getDefaultImageUrl(): string {
    return this.IMAGE_NOT_FOUND;
  }

  /**
   * Retorna a URL da marca padrão
   */
  getDefaultBrandUrl(): string {
    return this.BRAND_NOT_FOUND;
  }

  /**
   * Trata erro de carregamento de imagem
   */
  handleImageError(event: any, fallbackUrl?: string): void {
    const target = event.target;
    if (target) {
      target.src = fallbackUrl || this.IMAGE_NOT_FOUND;
      target.style.opacity = '0.7';
    }
  }

  /**
   * Pré-carrega uma imagem para verificar se está disponível
   */
  preloadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!url || this.isInvalidImage(url)) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
} 