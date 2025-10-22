import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly IMAGE_NOT_FOUND = '../../../assets/images/imagem_nao_encontrada.jpg';
  private readonly BRAND_NOT_FOUND = '../../../assets/images/sem_foto.png';

  constructor(private sanitizer: DomSanitizer) { }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (!imageUrl || this.isInvalidImage(imageUrl)) {
      return this.sanitizer.bypassSecurityTrustUrl(this.IMAGE_NOT_FOUND);
    }
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  sanitizeBrandUrl(brandUrl: string): SafeUrl {
    if (!brandUrl || this.isInvalidBrand(brandUrl)) {
      return this.sanitizer.bypassSecurityTrustUrl(this.BRAND_NOT_FOUND);
    }
    return this.sanitizer.bypassSecurityTrustUrl(brandUrl);
  }

  
  isInvalidImage(imageUrl: string): boolean {
    return !imageUrl || 
           imageUrl.includes('imagem_nao_encontrada.jpg') || 
           imageUrl === './static/img/imagem_nao_encontrada.jpg' ||
           imageUrl.trim() === '';
  }

  isInvalidBrand(brandUrl: string): boolean {
    return !brandUrl || 
           brandUrl.includes('./static/') || 
           brandUrl.trim() === '';
  }

  getDefaultImageUrl(): string {
    return this.IMAGE_NOT_FOUND;
  }

  getDefaultBrandUrl(): string {
    return this.BRAND_NOT_FOUND;
  }

  handleImageError(event: any, fallbackUrl?: string): void {
    const target = event.target;
    if (target) {
      target.src = fallbackUrl || this.IMAGE_NOT_FOUND;
      target.style.opacity = '0.7';
    }
  }

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