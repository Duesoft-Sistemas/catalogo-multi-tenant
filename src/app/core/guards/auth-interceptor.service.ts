import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authStorageService: AuthStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /*
     na tela de login nao quero interceptar nada, então
     dou continuidade no fluxo do request
    */
    if (
      request.url.includes(`/UserLogin`) ||
      request.url.includes(`/GetCompanies`)
    ) {
      return next.handle(request);
    }

    const requestJWT = this.addToken(
      request,
      this.authStorageService.getToken()
    );
    // capturando os possiveis erros do request
    return next.handle(requestJWT).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          return throwError(() => error);
          // this.authService.logoutRoute();
        } else if (error.status === 401) {
          /*
            Caso o erro seja um código 401
            inicio a logica pra o refresh do token
          */
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            /*
              Reiniciando o valor do token aqui para que os proximos pedidos
              aguardem até que o token volte da chamada de atualização do token.
            */
            this.refreshTokenSubject.next(null);
            return this.authStorageService.refreshToken().pipe(
              finalize(() => {
                this.isRefreshing = false;
              }),
              switchMap((data: any) => {
                // if (data.token != null) {
                //   const token = `${data.token}`;
                //   this.authStorageService.setToken(token);
                //   this.authStorageService.setRefreshToken(data.refreshToken);

                //   this.refreshTokenSubject.next(data.result.token);
                //   return next.handle(this.addToken(request, token));
                // }
                /*
                  se não for retornado o token, deu algum problema
                  então desconecto o usuario e lanço a exceção pra frente
                */
                this.authStorageService.logout();
                return throwError(() => 'A sua sessão expirou');
              }),
              catchError(() => {
                this.authStorageService.logout();
                return throwError(() => 'A sua sessão expirou');
              })
            );
          } else {
            /*
             Caso o token esteja em processe de atualização
            */
            return this.refreshTokenSubject.pipe(
              filter((token) => token != null),
              take(1),
              switchMap((token) => {
                return next.handle(this.addToken(request, token));
              })
            );
          }
        } else if (error.status === 403) {
          // this.authService.pageError(error);
          return throwError(() => 'Usuário sem permissão');
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
  }
}
