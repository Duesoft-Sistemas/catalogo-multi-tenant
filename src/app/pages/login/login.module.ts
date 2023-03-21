import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';

@NgModule({
  imports: [
    LoginRoutes,
    SharedModule,
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
