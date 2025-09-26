import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/core/services/global.service';
import { AuthStorageService } from 'src/app/core/guards/auth-storage.service';
import { SeletorPeculiaridadesCatalogos } from 'src/app/shared/classes/seletor-peculiaridades-catalogos';
import { ICarrinho } from 'src/app/shared/interface/ICarrinho';
import { Pessoas } from 'src/app/pages/pessoas/pessoas';
import { TenantService } from 'src/app/shared/tenant/tenant.service';
import { ProdutoCarrinho } from 'src/app/shared/classes/produto-carrinho';
import { Toaster } from 'src/app/shared/functions/toaster';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-concluir-pedido',
  templateUrl: './concluir-pedido.component.html',
  styleUrls: ['./concluir-pedido.component.css'],
})
export class ConcluirPedidoComponent implements OnInit {
  schema: string = '';
  carrinho: ProdutoCarrinho[] = [];
  total: number = 0;
  cliente: Pessoas = new Pessoas();
  spinner = false;
  currentItems: ProdutoCarrinho[] = [];
  allItems: ProdutoCarrinho[] = [];
  currentPage = 1;
  totalPaginas = 1;
  form: FormGroup;

  constructor(
    private serviceTenant: TenantService,
    private globalService: GlobalService,
    private authStorageService: AuthStorageService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.schema = this.serviceTenant.getSchemaTenant();
    this.form = this.fb.group({
      observacao: [''],
    });
  }

  ngOnInit(): void {
    this.authStorageService.setTitlePage('Concluir Pedido');
    this.loadCarrinho();
  }

  loadCarrinho() {
    this.carrinho = this.authStorageService.getCarrinho();
    this.currentItems = this.carrinho;
    this.allItems = this.carrinho;
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.carrinho.reduce((sum, item) => {
      const price = this.convertToNumber(item.produto.price);
      return sum + price * item.quantidade;
    }, 0);
  }

  convertToNumber(value: any): number {
    return parseFloat(value) || 0;
  }

  getPrice(produto: any, quantidade: number): number {
    const price = this.convertToNumber(produto.price);
    return price * quantidade;
  }

  // Função para converter stock para número de forma segura
  private getStockNumber(produto: any): number {
    if (produto?.stock === null || produto?.stock === undefined) {
      return 0;
    }

    // Se for string, converter para número
    if (typeof produto.stock === 'string') {
      const parsed = parseFloat(produto.stock);
      return isNaN(parsed) ? 0 : parsed;
    }

    // Se for número, retornar diretamente
    if (typeof produto.stock === 'number') {
      return produto.stock;
    }

    // Para outros tipos, tentar converter
    const converted = Number(produto.stock);
    return isNaN(converted) ? 0 : converted;
  }

  // Função para obter a quantidade máxima disponível considerando a unidade escolhida
  public getMaxAvailableQuantity(item: ProdutoCarrinho): number {
    const stockNumber = this.getStockNumber(item.produto);

    // Se não há estoque, retornar 0
    if (stockNumber <= 0) {
      return 0;
    }

    // Se está usando unidade2, considerar a conversão
    if (item.produto.unidadeEscolhida === item.produto.unity2) {
      const unitiesOnPackage2 = item.produto.unitiesOnPackage2 || 1;
      return Math.floor(stockNumber / unitiesOnPackage2);
    }

    // Para unidade padrão, retornar o estoque diretamente
    return stockNumber;
  }

  diminuiQuantidade(item: ProdutoCarrinho) {
    if (item.quantidade > 1) {
      item.quantidade--;
      this.authStorageService.atualizaItemCarrinho(item);
      this.calculateTotal();
    }
  }

  aumentaQuantidade(item: ProdutoCarrinho) {
    const maxAvailable = this.getMaxAvailableQuantity(item);

    // Verificar se não há estoque disponível
    if (maxAvailable <= 0) {
      Toaster.Warning('Produto sem estoque disponível!');
      return;
    }

    // Verificar se já atingiu o limite de estoque
    if (item.quantidade >= maxAvailable) {
      // Tentar buscar informações atualizadas de estoque
      this.atualizarEstoqueProduto(item);
      Toaster.Warning(
        `Quantidade máxima de estoque atingida! Máximo disponível: ${maxAvailable}`
      );
      return;
    }

    item.quantidade++;
    this.authStorageService.atualizaItemCarrinho(item);
    this.calculateTotal();
  }

  // Método para atualizar informações de estoque do produto
  private atualizarEstoqueProduto(item: ProdutoCarrinho) {
    this.globalService.getDetalhesProduto(item.produto.id).subscribe({
      next: (data) => {
        if (data && data.stock !== undefined) {
          // Atualizar o estoque do produto
          item.produto.stock = data.stock;
          item.produto.stockStatus = data.stockStatus;

          // Recarregar o carrinho para refletir as mudanças
          this.loadCarrinho();
        }
      },
      error: (error) => {
        // Tratar erro silenciosamente
      },
    });
  }

  habilitaDesabilitaDiminui(item: ProdutoCarrinho): boolean {
    return item.quantidade <= 1;
  }

  habilitaDesabilitaAumenta(item: ProdutoCarrinho): boolean {
    const maxAvailable = this.getMaxAvailableQuantity(item);

    // Desabilitar se não há estoque disponível
    if (maxAvailable <= 0) {
      return true;
    }

    // Desabilitar se já atingiu o limite
    return item.quantidade >= maxAvailable;
  }

  remover(item: ProdutoCarrinho) {
    this.authStorageService.removeProdutoCarrinho(item);
    this.loadCarrinho();
  }

  getTotal(): number {
    return this.total;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  openModalConfirmConcluir() {
    if (this.allItems.length === 0) {
      Toaster.Warning('Não há itens no carrinho para finalizar o pedido.');
      return;
    }

    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Pedido?',
        subTitle: 'Deseja realmente finalizar o pedido?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.finalizarPedido();
      }
    });
  }

  finalizarPedido() {
    this.spinner = true;
    const observacao = this.form.get('observacao')?.value || '';

    // Converter para o formato esperado pela API
    const itensCarrinho = this.allItems.map((item) => {
      return {
        id: item.produto.id,
        image: item.produto.image,
        code: item.produto.code,
        productGroup: item.produto.productGroup,
        description: item.produto.description,
        qtd: 0.0,
        appQtd: item.quantidade,
        unity: item.produto.unidadeEscolhida,
        price: 0.0,
        appPrice:
          item.produto.unidadeEscolhida === item.produto.unity2
            ? +Number(item.produto.price2.toString().replace(',', '.'))
            : +item.produto.price.toString().replace(',', '.'),
        totalPrice: 0.0,
        appTotalPrice:
          item.produto.unidadeEscolhida === item.produto.unity2
            ? item.quantidade *
              +item.produto.price2.toString().replace(',', '.')
            : item.quantidade *
              +item.produto.price.toString().replace(',', '.'),
        observacao: observacao,
      };
    });

    this.globalService.concluirPedido(itensCarrinho, observacao).subscribe({
      next: (response) => {
        Toaster.Success('Pedido finalizado com sucesso!');
        this.authStorageService.limpaCarrinho();
        this.router.navigate(['/pedidos-realizados']);
        this.spinner = false;
      },
      error: (error) => {
        console.error('Erro ao finalizar pedido:', error);
        Toaster.Error('Erro ao finalizar pedido. Por favor, tente novamente.');
        this.spinner = false;
      },
    });
  }
}
