import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Guards
import { AuthGuardService } from './guards/auth-guard.service';
import { AuthStorageService } from './guards/auth-storage.service';
import { AuthInterceptorService } from './guards/auth-interceptor.service';

// Services
import { GlobalService } from './services/global.service';
import { EstadosService } from './services/estados.service';

// Tenant
import { TenantService } from './tenant/tenant.service';
import { TenantInterceptor } from './tenant/tenant.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    // Guards
    AuthGuardService,
    AuthStorageService,
    
    // Services
    GlobalService,
    EstadosService,
    TenantService,
    
    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule já foi carregado. Importe apenas no AppModule.');
    }
  }
}
