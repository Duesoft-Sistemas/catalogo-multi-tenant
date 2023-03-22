import { Injectable } from '@angular/core';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authStorageService: AuthStorageService) {}

  canActivate() {
    if (this.authStorageService.isLoggedIn()) {
      return true;
    }
    return false;
  }
}
