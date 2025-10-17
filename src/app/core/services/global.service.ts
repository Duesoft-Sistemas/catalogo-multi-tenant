import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLogin } from 'src/app/pages/login/login.model';
import { Pessoas } from 'src/app/pages/pessoas/pessoas';
import { environment } from 'src/environments/environment';
import { AlterarSenha } from '../../shared/classes/alterar-senha';
import { FiltroPedidosRealizados } from '../../shared/classes/filtro-pedidos-realizados';
import { FiltroPesquisarProdutos } from '../../shared/classes/filtro-pesquisar-produtos';
import { FiltroRelatorioFinanceiro } from '../../shared/classes/filtro-relatorio-financeiro';
import { RecuperarSenha } from '../../shared/classes/recuperar-senha';
import { ICarrinho } from '../../shared/interface/ICarrinho';
import { TenantService } from '../tenant/tenant.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  baseUrl: string;

  constructor(
    protected http: HttpClient,
    private serviceTenant: TenantService,
    private router : Router
  ) {
    this.baseUrl = `${environment.UrlBase}/${environment.SchemaDSCOP}`;
  }

  login(model?: UsuarioLogin): Observable<any> {
    return this.http.post(`${this.baseUrl}/UserLogin`, model);
  }

  getCompanies(cnpj: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/GetCompanies?id=${cnpj}&schema=${this.serviceTenant.getSchemaTenant()}`
    );
  }

  getAllCompanies(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/GetAllCompanies?schema=${this.serviceTenant.getSchemaTenant()}`
    );
  }

  getDetalhesProduto(idProduto: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetProductInfo?id=${idProduto}`);
  }

  getEmail(cnpj: string): Observable<any> {
    const cleanCnpj = this.sanitizeDocument(cnpj);
    return this.http.get(
      `${this.baseUrl}/GetEmail?id=${cleanCnpj}&schema=${this.serviceTenant.getSchemaTenant()}`
    );
  }

  cadastrarUsuario(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/CadastrarUsuario?schema=${this.serviceTenant.getSchemaTenant()}`,
      data
    );
  }

  alterarSenha(data: AlterarSenha): Observable<any> {
    return this.http.post(`${this.baseUrl}/ChangePassword`, data);
  }

  recuperarSenha(data: RecuperarSenha): Observable<any> {
    return this.http.post(`${this.baseUrl}/RecoverPassword`, data ,{responseType: 'text'});
  }

  getProdutosPorDescricaoCode(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/GetSpecificProducts`, data);
  }

  getProdutosPesquisa(filtro: FiltroPesquisarProdutos): Observable<any> {
    return this.http.post(`${this.baseUrl}/GetSpecificProducts`, filtro);
  }

  getProdutosPromocao(pagina: number): Observable<any> {
    let data = { PromocaoSomenteCatalogo: true, Page: pagina };
    return this.http.post(`${this.baseUrl}/GetSpecificProducts`, data);
  }

  getProdutosLancamentos(pagina: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetSummaryNewProducts?id=${pagina}`);
  }

  getRelatorioFinanceiro(filtro: FiltroRelatorioFinanceiro): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/GetSpecificFinancialHistory`,
      filtro.getFiltro()
    );
  }

  getPedidosRealizados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetSummaryOrders`);
  }

  detalhesPedidosRealizados(solicitationNumber: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/GetOrderInfo?id=${solicitationNumber}`
    );
  }

  concluirPedido(data: ICarrinho[], observacao: string): Observable<any> {
    let obj = {
      itens: data,
      observacao: observacao,
    };
    return this.http.post(`${this.baseUrl}/SendOrder`, obj);
  }

  cancelarPedido(solicitationNumber: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/CancelOrder?order=${solicitationNumber}`,
      solicitationNumber,
      { responseType: 'text' }
    );
  }

  getDevolucoes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ObterDevolucoes`);
  }

  getFornecedores(): Observable<any> {
    return this.http.get(`${environment.UrlBase}/GetSuppliers?schema=${this.serviceTenant.getSchemaTenant()}`);
  }

  getProdutosFornecedores(data: any): Observable<any> {
    return this.http.post(`${environment.UrlBase}/GetSpecificSuppliers`, data);
  }

  filtrarPedidosRealizados(filtro: FiltroPedidosRealizados): Observable<any> {
    return this.http.post(`${this.baseUrl}/SearchOrders`, filtro);
  }

  getStatusPedidos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllOrderStatus`);
  }

  getProdutosFiltro(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/PesquisaInicial`, data);
  }

  getProdutosComEstoque(): Observable<any> {
    return this.http.post(`${this.baseUrl}/GetSpecificProducts`, {
      code: '',
      description: '',
      page: 1,
      pageSize: 1000, // Buscar muitos produtos de uma vez
      apenasComEstoque: true // Flag para indicar que queremos apenas produtos com estoque
    });
  }

  getMarcas(): Observable<any>  {
    return this.http.get(`${this.baseUrl}/ObterMarcasProdutos`);
  }

  getGrupos(): Observable<any>  {
    return this.http.get(`${this.baseUrl}/ObterDepartamentos`);
  }

  getSubgrupos(): Observable<any>  {
    return this.http.get(`${this.baseUrl}/ObterSubDepartamentos`);
  }

  getSubgruposPorId(id: number): Observable<any>  {
    return this.http.get(`${this.baseUrl}/ObterSubDepartamentosPorIdGrupo/${id}`);
  }

  /**
   * Sanitiza documentos removendo caracteres especiais
   * @param doc Documento a ser sanitizado (CNPJ, CPF, etc.)
   * @returns Documento limpo apenas com números
   */
  private sanitizeDocument(doc: string | null | undefined): string {
    if (!doc) return '';
    return doc.replace(/[.\-\/]/g, '').trim();
  }
}
