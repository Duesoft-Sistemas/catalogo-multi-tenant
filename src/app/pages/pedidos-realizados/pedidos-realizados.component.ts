import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { FiltroPedidosRealizados } from 'src/app/shared/classes/filtro-pedidos-realizados';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IPedidos } from 'src/app/shared/interface/IPedidos';
import { IPedidosRealizados } from 'src/app/shared/interface/IPedidosRealizados';
import { GlobalService } from 'src/app/shared/services/global.service';
import { PedidosRealizadosDetalhesComponent } from './pedidos-realizados-detalhes/pedidos-realizados-detalhes.component';
import { PedidosRealizadosFiltroComponent } from './pedidos-realizados-filtro/pedidos-realizados-filtro.component';
import { TenantService } from 'src/app/shared/tenant/tenant.service';

@Component({
  selector: 'app-pedidos-realizados',
  templateUrl: './pedidos-realizados.component.html',
  styleUrls: ['./pedidos-realizados.component.css'],
})
export class PedidosRealizadosComponent implements OnInit {
  schema = '';
  spinner = false;
  hasData = false;
  totalPedidos = 0;
  pedidosPendentes = 0;
  pedidosAprovados = 0;
  totalPaginas = 0;
  currentPage = 1;
  pageSize = 3; // Temporariamente 3 para testar
  
  columns = [
    {
      columnDef: 'solicitacao',
      header: 'Solicitação Nº',
      cell: (element: IPedidos) => `${element.solicitationNumber}`,
    },
    {
      columnDef: 'pedido',
      header: 'Pedido Nº',
      cell: (element: IPedidos) =>
        `${element.orderNumber == 0 ? '-' : element.orderNumber}`,
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: IPedidos) => `${element.status}`,
    },
    {
      columnDef: 'data',
      header: 'Data',
      cell: (element: IPedidos) => this.formatOrderDate(element.orderDate),
    },
    {
      columnDef: 'valor',
      header: 'Valor',
      cell: (element: IPedidos) => this.formatTotalPriceSimple(element.totalPrice),
    },
  ];

  dataSource: MatTableDataSource<IPedidos> = new MatTableDataSource<IPedidos>();
  filtro: FiltroPedidosRealizados = new FiltroPedidosRealizados();

  constructor(
    private service: GlobalService,
    private storage: AuthStorageService,
    public dialog: MatDialog,
    private tenantService: TenantService
  ) {
    this.schema = this.tenantService.getSchemaTenant();
    this.schema = this.tenantService.getSchemaTenant();
  }

  ngOnInit() {
    this.storage.setTitlePage('Meus Pedidos');
    this.getDados();
  }

  openModalDetalhes(dados: IPedidosRealizados): void {
    const dialogRef = this.dialog.open(PedidosRealizadosDetalhesComponent, {
      data: dados.solicitationNumber,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getDados();
    });
  }

  openModalFiltro(): void {
    try {
      const dialogRef = this.dialog.open(PedidosRealizadosFiltroComponent, {
        width: '400px',
        data: this.filtro,
        disableClose: false,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          try {
            this.filtro = new FiltroPedidosRealizados(result);
            this.currentPage = 1; // Reset para primeira página ao aplicar filtro
            this.getDadosFiltros();
          } catch (error) {
            console.error('Erro ao processar resultado do filtro:', error);
            Toaster.Error('Erro ao processar filtro. Tente novamente.');
          }
        }
      });
    } catch (error) {
      console.error('Erro ao abrir modal de filtro:', error);
      Toaster.Error('Erro ao abrir filtro. Tente novamente.');
    }
  }

  limparFiltros(): void {
    this.filtro = new FiltroPedidosRealizados();
    this.currentPage = 1;
    this.getDados();
    Toaster.Success('Filtros limpos. Exibindo todos os pedidos.');
  }

  // Método para navegar entre páginas
  goToPage(event: any): void {
    const page = event.page || event;
    this.currentPage = page;
    this.filtro.page = page;
    
    if (this.filtro.initialDate || this.filtro.finalDate || (this.filtro.status && this.filtro.status.length > 0)) {
      this.getDadosFiltros();
    } else {
      this.getDados();
    }
  }

  // Método para obter as páginas visíveis (exatamente como no catálogo)
  getVisiblePages(): (number | string)[] {
    if (!this.totalPaginas) return [];

    const isMobile = window.innerWidth <= 640;
    const isSmallMobile = window.innerWidth <= 480;
    
    let maxVisiblePages = 5; // Padrão para desktop
    
    if (isSmallMobile) {
      maxVisiblePages = 3; // Apenas 3 páginas para telas muito pequenas
    } else if (isMobile) {
      maxVisiblePages = 4; // 4 páginas para mobile
    }
    
    const pages: (number | string)[] = [];
    
    if (this.totalPaginas <= maxVisiblePages) {
      // Se temos páginas suficientes ou menos, mostrar todas
      for (let i = 1; i <= this.totalPaginas; i++) {
        pages.push(i);
      }
    } else {
      // Se temos mais páginas, mostrar uma janela responsiva
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPaginas, startPage + maxVisiblePages - 1);
      
      // Ajustar se chegamos ao final
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Adicionar elipsis inicial se necessário (apenas se não for mobile muito pequeno)
      if (startPage > 1 && !isSmallMobile) {
        pages.push('start-ellipsis');
      }
      
      // Adicionar páginas numeradas
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Adicionar elipsis final se necessário (apenas se não for mobile muito pequeno)
      if (endPage < this.totalPaginas && !isSmallMobile) {
        pages.push('end-ellipsis');
      }
    }
    
    return pages;
  }

  // Método para verificar se é tela muito pequena
  isVerySmallScreen(): boolean {
    return window.innerWidth <= 480;
  }

  private calcularEstatisticas(data: IPedidos[]): void {
    this.totalPedidos = data.length;
    this.pedidosPendentes = data.filter(pedido => 
      pedido.status?.toLowerCase().includes('pendente') || 
      pedido.status?.toLowerCase().includes('aguardando')
    ).length;
    this.pedidosAprovados = data.filter(pedido => 
      pedido.status?.toLowerCase().includes('aprovado') || 
      pedido.status?.toLowerCase().includes('confirmado')
    ).length;
  }

  private getDados(): void {
    this.spinner = true;
    this.service
      .getPedidosRealizados()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            data.sort((a, b) => {
              return b.solicitationNumber - a.solicitationNumber;
            });
            
            // Calcular total de páginas
            this.totalPaginas = Math.ceil(data.length / this.pageSize);
            
            // Aplicar paginação
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const pedidosPaginados = data.slice(startIndex, endIndex);
            
            this.dataSource = new MatTableDataSource<IPedidos>(pedidosPaginados);
            this.hasData = data.length > 0;
            this.calcularEstatisticas(data);

            if (data.length <= 0) {
              Toaster.Warning('Nenhum pedido encontrado.');
            }
          } else {
            this.hasData = false;
            this.totalPaginas = 0;
            this.calcularEstatisticas([]);
            Toaster.Warning('Nenhum pedido encontrado.');
          }
        },
        error: (error) => {
          Toaster.Error(error);
          this.spinner = false;
          this.hasData = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

    private getDadosFiltros(): void {
    this.spinner = true;
    
    // Validar se há filtros aplicados
    if (!this.temFiltrosAplicados()) {
      Toaster.Warning('Nenhum filtro foi aplicado. Carregando todos os pedidos.');
      this.getDados();
      return;
    }
    
    this.service
      .filtrarPedidosRealizados(this.filtro)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data && Array.isArray(data)) {
            // Aplicar filtros no frontend
            const resultadoFiltro = this.aplicarFiltrosFrontend(data);
            
            if (resultadoFiltro.sucesso) {
              const dadosFiltrados = resultadoFiltro.dados;
              
              // Calcular total de páginas
              this.totalPaginas = Math.ceil(dadosFiltrados.length / this.pageSize);
              
              // Aplicar paginação
              const startIndex = (this.currentPage - 1) * this.pageSize;
              const endIndex = startIndex + this.pageSize;
              const pedidosPaginados = dadosFiltrados.slice(startIndex, endIndex);
              
              this.dataSource = new MatTableDataSource<IPedidos>(pedidosPaginados);
              this.dataSource.filter = '';
              this.hasData = dadosFiltrados.length > 0;
              this.calcularEstatisticas(dadosFiltrados);
              
              if (dadosFiltrados.length === 0) {
                Toaster.Warning('Nenhum pedido encontrado com os filtros aplicados.');
              } else {
                Toaster.Success(`Encontrados ${dadosFiltrados.length} pedido(s) com os filtros aplicados.`);
              }
            } else {
              Toaster.Error(resultadoFiltro.mensagem);
              this.getDados(); // Volta para dados sem filtro
            }
          } else {
            this.hasData = false;
            this.totalPaginas = 0;
            this.calcularEstatisticas([]);
            Toaster.Warning('Nenhum pedido encontrado.');
          }
        },
        error: (error) => {
          console.error('Erro ao filtrar pedidos:', error);
          Toaster.Error('Erro ao aplicar filtros. Tente novamente.');
          this.getDados(); // Volta para dados sem filtro
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  public temFiltrosAplicados(): boolean {
    const temDataInicial = this.filtro.initialDate && this.filtro.initialDate.toString() !== '';
    const temDataFinal = this.filtro.finalDate && this.filtro.finalDate.toString() !== '';
    const temStatus = this.filtro.status && Array.isArray(this.filtro.status) && this.filtro.status.length > 0;
    
    return !!(temDataInicial || temDataFinal || temStatus);
  }

  private aplicarFiltrosFrontend(data: IPedidos[]): { sucesso: boolean; dados: IPedidos[]; mensagem?: string } {
    try {
      let dadosFiltrados = [...data];

      // Filtrar por data inicial
      if (this.filtro.initialDate) {
        const dataInicial = this.converterData(this.filtro.initialDate);
        if (isNaN(dataInicial.getTime())) {
          return {
            sucesso: false,
            dados: [],
            mensagem: 'Data inicial inválida. Use o formato DD/MM/AAAA.'
          };
        }
        
        dadosFiltrados = dadosFiltrados.filter(pedido => {
          const dataPedido = this.converterData(pedido.orderDate);
          const dataPedidoOnly = new Date(dataPedido.getFullYear(), dataPedido.getMonth(), dataPedido.getDate());
          const dataInicialOnly = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate());
          return dataPedidoOnly >= dataInicialOnly;
        });
      }

      // Filtrar por data final
      if (this.filtro.finalDate) {
        const dataFinal = this.converterData(this.filtro.finalDate);
        if (isNaN(dataFinal.getTime())) {
          return {
            sucesso: false,
            dados: [],
            mensagem: 'Data final inválida. Use o formato DD/MM/AAAA.'
          };
        }
        
        dadosFiltrados = dadosFiltrados.filter(pedido => {
          const dataPedido = this.converterData(pedido.orderDate);
          const dataPedidoOnly = new Date(dataPedido.getFullYear(), dataPedido.getMonth(), dataPedido.getDate());
          const dataFinalOnly = new Date(dataFinal.getFullYear(), dataFinal.getMonth(), dataFinal.getDate());
          return dataPedidoOnly <= dataFinalOnly;
        });
      }

      // Filtrar por status - Corrigido para comparar descrições
      if (this.filtro.status && this.filtro.status.length > 0) {
        
        dadosFiltrados = dadosFiltrados.filter(pedido => {
          const pedidoStatus = pedido.status;
          
          return this.filtro.status.some((statusDesc: string) => {
            const match = pedidoStatus.toLowerCase() === statusDesc.toLowerCase();
            return match;
          });
        });
        
      }

      return {
        sucesso: true,
        dados: dadosFiltrados
      };
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
      return {
        sucesso: false,
        dados: [],
        mensagem: 'Erro ao aplicar filtros. Tente novamente.'
      };
    }
  }

  private converterData(data: Date | string): Date {
    if (!data) return new Date(0);
    
    try {
      if (typeof data === 'string') {
        // Se já está no formato brasileiro (dd/mm/yyyy)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
          const [day, month, year] = data.split('/');
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Se está no formato ISO (yyyy-mm-dd)
        else if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
          return new Date(data);
        }
        // Se está no formato ISO com T (yyyy-mm-ddTHH:mm:ss)
        else if (/^\d{4}-\d{2}-\d{2}T/.test(data)) {
          return new Date(data);
        }
        // Tenta o formato padrão do JavaScript
        else {
          return new Date(data);
        }
      } else {
        return data;
      }
    } catch (error) {
      return new Date(0);
    }
  }

  // Método para trackBy do ngFor (performance)
  trackByPedido(index: number, pedido: IPedidos): number {
    return pedido.solicitationNumber;
  }

  // Método para definir classes CSS do status
  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('aprovado') || statusLower.includes('confirmado')) {
      return '!bg-green-100 !text-green-800 !border !border-green-200';
    } else if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
      return '!bg-yellow-100 !text-yellow-800 !border !border-yellow-200';
    } else if (statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
      return '!bg-red-100 !text-red-800 !border !border-red-200';
    } else if (statusLower.includes('entregue') || statusLower.includes('finalizado')) {
      return '!bg-blue-100 !text-blue-800 !border !border-blue-200';
    } else {
      return '!bg-gray-100 !text-gray-800 !border !border-gray-200';
    }
  }

  // Método para formatar o valor total
  formatTotalPrice(totalPrice: string | number): string {
    if (!totalPrice) return 'R$ 0,00';
    
    let numericValue: number;
    
    if (typeof totalPrice === 'string') {
      // Remove caracteres não numéricos exceto vírgula e ponto
      const cleanValue = totalPrice.replace(/[^\d,.-]/g, '');
      // Converte vírgula para ponto para parsing
      const normalizedValue = cleanValue.replace(',', '.');
      numericValue = parseFloat(normalizedValue) || 0;
    } else {
      numericValue = totalPrice;
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  }

  // Método alternativo para formatação simples
  formatTotalPriceSimple(totalPrice: string | number): string {
    if (!totalPrice) return 'R$ 0,00';
    
    const value = typeof totalPrice === 'string' ? parseFloat(totalPrice) || 0 : totalPrice;
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  // Método para formatar a data do pedido
  formatOrderDate(orderDate: Date | string): string {
    if (!orderDate) return 'Data não informada';
    
    try {
      let date: Date;
      
      if (typeof orderDate === 'string') {
        // Tenta diferentes formatos de data
        const dateStr = orderDate.trim();
        
        // Se já está no formato brasileiro (dd/mm/yyyy)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Se está no formato ISO (yyyy-mm-dd)
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          date = new Date(dateStr);
        }
        // Se está no formato brasileiro com hífen (dd-mm-yyyy)
        else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('-');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Tenta o formato padrão do JavaScript
        else {
          date = new Date(dateStr);
        }
      } else {
        date = orderDate;
      }
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data não informada';
      }
      
      // Formata como data brasileira
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Data não informada';
    }
  }
}
