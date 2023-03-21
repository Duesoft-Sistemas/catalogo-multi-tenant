import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TenantInterceptor } from "./tenant.interceptor";

@NgModule({
  declarations: [],
  imports: [ CommonModule ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: HTTP_INTERCEPTORS, useValue: 'pt-BR' , useClass: TenantInterceptor, multi: true }
]
})
export class TenantModule { }
