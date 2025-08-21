import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDataStorage } from '../../shared/interface/IDataStorage';
import { ProdutoCarrinho } from '../../shared/classes/produto-carrinho';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  urlBase = environment.UrlBase;
  idStorage = environment.idLocalStorage;

  constructor(private http: HttpClient) {}

  refreshToken(): Observable<any> {
    const loginDto = { Token: this.getRefreshToken() };
    return this.http.post<any>(`${this.urlBase}`, loginDto);
  }

  logout(): void {
    localStorage.clear();
    location.reload();
  }

  setDataStorage(data: IDataStorage): void {
    localStorage.setItem(this.idStorage, JSON.stringify(data));
  }

  getDataStorage(): IDataStorage {
    const dados = localStorage.getItem(this.idStorage);
    return dados ? JSON.parse(dados) : null;
  }

  getToken(): string {
    return this.getDataStorage()?.authorization;
  }

  setToken(token: string): void {
    const data = this.getDataStorage();
    data.authorization = token;
    this.setDataStorage(data);
  }

  getRefreshToken(): string | undefined {
    return this.getDataStorage()?.refreshToken;
  }

  setRefreshToken(refreshToken: any): void {
    const data = this.getDataStorage();
    data.refreshToken = refreshToken;
    this.setDataStorage(data);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getTokenExpirationDate(token: string): any {
    const date = new Date(0);
    try {
      const decoded: any = jwt_decode(token);

      if (decoded.exp === undefined) {
        return null;
      }

      date.setUTCSeconds(decoded.exp);
    } catch (error) {
      return null;
    }
    return date;
  }

  isTokenExpired(): boolean {
    let token = this.getToken();
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (!date) {
      return false;
    }

    return !(date.valueOf() > new Date().valueOf());
  }

  setTitlePage(title: string): void {
    let data = this.getDataStorage();
    data.titlePage = title;
    this.setDataStorage(data);
  }

  getTitlePage(): string {
    return this.getDataStorage()?.titlePage;
  }

  getVinculoGrupoSubGrupo(): boolean | null {
    return this.getDataStorage().vinculoGrupoSubGrupo;
  }

  getCarrinho(): ProdutoCarrinho[] {
    return this.getDataStorage().carrinho;
  }

  addProdutoCarrinho(item: ProdutoCarrinho): void {
    let data = this.getDataStorage();
    let index //= data.carrinho.findIndex(x => {x.produto.code === item.produto.code});
    data.carrinho.forEach((itemCarrinho, indexCarrinho)=>{
      if(itemCarrinho.produto.code === item.produto.code && itemCarrinho.produto.unidadeEscolhida === item.produto.unidadeEscolhida)
        index = indexCarrinho;
    });
    if (index >= 0) data.carrinho[index].quantidade += item.quantidade;
    else data.carrinho.push(item);
    this.setDataStorage(data);
  }

  removeProdutoCarrinho(item: ProdutoCarrinho): ProdutoCarrinho[] {
    let data = this.getDataStorage();
    let index //= data.carrinho.findIndex(x => x.produto.code === item.produto.code);
    data.carrinho.forEach((itemCarrinho, indexCarrinho)=>{
      if(itemCarrinho.produto.code === item.produto.code && itemCarrinho.produto.unidadeEscolhida === item.produto.unidadeEscolhida)
        index = indexCarrinho;
    });
    data.carrinho.splice(index, 1);
    this.setDataStorage(data);
    return data.carrinho;
  }

  atualizaItemCarrinho(item: ProdutoCarrinho): void {
    let data = this.getDataStorage();
    let index //= data.carrinho.findIndex(x => x.produto.code === item.produto.code);
    data.carrinho.forEach((itemCarrinho, indexCarrinho)=>{
      if(itemCarrinho.produto.code === item.produto.code && itemCarrinho.produto.unidadeEscolhida === item.produto.unidadeEscolhida)
        index = indexCarrinho;
    });
    if (index >= 0) data.carrinho[index] = item;
    this.setDataStorage(data);
  }

  limpaCarrinho(): void{
    let data = this.getDataStorage();
    data.carrinho = [];
    this.setDataStorage(data);
  }
}
