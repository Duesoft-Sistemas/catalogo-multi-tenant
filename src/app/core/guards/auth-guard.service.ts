import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private authStorageService: AuthStorageService,
    private router: Router
  ) {}

  canActivate() {
    if (this.authStorageService.isLoggedIn()) {
      return true;
    }
    
    // Redirecionar para login se não estiver autenticado
    this.router.navigate(['/login']);
    return false;
  }
}
