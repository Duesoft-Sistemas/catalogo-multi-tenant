import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IPedidosRealizadosDetalhes, IItensPedidosRealizadosDetalhes } from '../interface/IPedidosRealizadosDetalhes';
import { IPedidos } from '../interface/IPedidos';
import { TenantService } from '../tenant/tenant.service';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private tenantService: TenantService) {}

  /**
   * Gera um PDF com os dados do pedido (salva automaticamente e abre para impressão)
   * @param pedido Dados do pedido a ser exportado
   */
  generatePedidoPDF(pedido: IPedidosRealizadosDetalhes): void {
    const doc = new jsPDF();
    const companyName = this.tenantService.getCompanyNameBySchema();
    
    // Configurações de cores e fontes
    const primaryColor = [41, 128, 185]; // Azul
    const secondaryColor = [149, 165, 166]; // Cinza
    const textColor = [44, 62, 80]; // Cinza escuro
    
    // Cabeçalho
    this.addHeader(doc, companyName, primaryColor);
    
    // Informações do pedido
    this.addPedidoInfo(doc, pedido, textColor, secondaryColor);
    
    // Tabela de itens
    this.addItensTable(doc, pedido.itens, primaryColor);
    
    // Resumo financeiro
    this.addResumoFinanceiro(doc, pedido, primaryColor, textColor);
    
    // Rodapé
    this.addFooter(doc, secondaryColor);
    
    // Salvar o arquivo primeiro
    const fileName = `Pedido_${pedido.solicitationNumber}_${this.formatDateForFileName(new Date())}.pdf`;
    doc.save(fileName);
    
    // Em seguida, abrir para impressão
    setTimeout(() => {
      this.printPDF(doc);
    }, 500); // Aguarda 500ms para garantir que o download iniciou
  }

  /**
   * Gera PDF com múltiplos pedidos (resumido) - salva automaticamente e abre para impressão
   * @param pedidos Array de pedidos a serem exportados
   */
  generateMultiplePedidosPDF(pedidos: IPedidos[]): void {
    if (!pedidos || pedidos.length === 0) {
      throw new Error('Nenhum pedido fornecido para geração do PDF');
    }

    const doc = new jsPDF();
    const companyName = this.tenantService.getCompanyNameBySchema();
    
    // Configurações de cores e fontes
    const primaryColor = [41, 128, 185]; // Azul
    const secondaryColor = [149, 165, 166]; // Cinza
    const textColor = [44, 62, 80]; // Cinza escuro

    // Cabeçalho
    this.addMultipleOrdersHeader(doc, companyName, primaryColor, pedidos.length);
    
    // Tabela resumida de pedidos
    this.addMultipleOrdersTable(doc, pedidos, primaryColor);
    
    // Resumo geral
    this.addMultipleOrdersSummary(doc, pedidos, primaryColor, textColor);
    
    // Rodapé
    this.addFooter(doc, secondaryColor);

    // Salvar o arquivo primeiro
    const fileName = `Relatorio_Pedidos_${this.formatDateForFileName(new Date())}.pdf`;
    doc.save(fileName);
    
    // Em seguida, abrir para impressão
    setTimeout(() => {
      this.printPDF(doc);
    }, 500); // Aguarda 500ms para garantir que o download iniciou
  }

  /**
   * Abre o PDF para impressão
   * @param doc Documento jsPDF
   */
  private printPDF(doc: jsPDF): void {
    // Gera o PDF como blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Abre em nova janela para impressão
    const printWindow = window.open(pdfUrl, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        
        // Limpa a URL do blob após um tempo
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
      };
    } else {
      // Fallback se popup foi bloqueado
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Pedidos_${this.formatDateForFileName(new Date())}.pdf`;
      link.click();
      URL.revokeObjectURL(pdfUrl);
    }
  }

  /**
   * Adiciona o cabeçalho do PDF
   */
  private addHeader(doc: jsPDF, companyName: string, primaryColor: number[], pageNum?: number, totalPages?: number): void {
    const pageWidth = doc.internal.pageSize.width;
    
    // Retângulo do cabeçalho
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Nome da empresa
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 20, 20);
    
    // Título do documento
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const title = pageNum && totalPages ? `DETALHES DO PEDIDO (${pageNum}/${totalPages})` : 'DETALHES DO PEDIDO';
    doc.text(title, 20, 32);
    
    // Data de geração
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dateStr}`, pageWidth - 20, 32, { align: 'right' });
  }

  /**
   * Adiciona cabeçalho para múltiplos pedidos
   */
  private addMultipleOrdersHeader(doc: jsPDF, companyName: string, primaryColor: number[], totalOrders: number): void {
    const pageWidth = doc.internal.pageSize.width;
    
    // Retângulo do cabeçalho
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Nome da empresa
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 20, 20);
    
    // Título do documento
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`RELATÓRIO DE PEDIDOS (${totalOrders} pedidos)`, 20, 32);
    
    // Data de geração
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dateStr}`, pageWidth - 20, 32, { align: 'right' });
  }

  /**
   * Adiciona as informações principais do pedido
   */
  private addPedidoInfo(doc: jsPDF, pedido: IPedidosRealizadosDetalhes, textColor: number[], secondaryColor: number[]): void {
    let yPosition = 55;
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações do Pedido', 20, yPosition);
    
    yPosition += 15;
    
    // Configurar fonte para os dados
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const info = [
      ['Número da Solicitação:', pedido.solicitationNumber?.toString() || '-'],
      ['Número do Pedido:', pedido.orderNumber?.toString() || '-'],
      ['Empresa:', pedido.company || '-'],
      ['Data do Pedido:', this.formatDate(pedido.orderDate)],
      ['Situação:', this.formatStatus(pedido.status)]
    ];
    
    info.forEach(([label, value]) => {
      // Label em negrito
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      
      // Valor normal
      doc.setFont('helvetica', 'normal');
      doc.text(value, 120, yPosition);
      
      yPosition += 12;
    });
  }

  /**
   * Adiciona a tabela de itens do pedido
   */
  private addItensTable(doc: jsPDF, itens: IItensPedidosRealizadosDetalhes[], primaryColor: number[]): void {
    const startY = 150;
    
    // Título da seção
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Itens do Pedido', 20, startY - 10);
    
    // Preparar dados da tabela
    const tableData = itens.map(item => [
      `${item.code}`,
      item.description || '-',
      `${item.appQtd}/${item.unity}`,
      this.formatCurrency(item.appPrice),
      this.formatCurrency(item.appTotalPrice)
    ]);
    
    // Configurar a tabela
    autoTable(doc, {
      startY: startY,
      head: [['Código', 'Descrição', 'Qtde/Unidade', 'Valor Unit.', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]] as [number, number, number],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Código
        1: { cellWidth: 70 }, // Descrição
        2: { cellWidth: 30 }, // Qtde/Unidade
        3: { cellWidth: 30 }, // Valor Unit.
        4: { cellWidth: 35 }  // Total
      },
      margin: { left: 20, right: 20 }
    });
  }

  /**
   * Adiciona tabela resumida para múltiplos pedidos
   */
  private addMultipleOrdersTable(doc: jsPDF, pedidos: IPedidos[], primaryColor: number[]): void {
    const startY = 60;
    
    // Preparar dados da tabela
    const tableData = pedidos.map(pedido => [
      pedido.solicitationNumber?.toString() || '-',
      pedido.orderNumber === 0 ? '-' : pedido.orderNumber?.toString() || '-',
      this.formatStatus(pedido.status),
      this.formatDate(pedido.orderDate),
      this.formatCurrency(pedido.totalPrice)
    ]);
    
    // Configurar a tabela
    autoTable(doc, {
      startY: startY,
      head: [['Solicitação Nº', 'Pedido Nº', 'Status', 'Data', 'Valor Total']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]] as [number, number, number],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Solicitação
        1: { cellWidth: 30 }, // Pedido
        2: { cellWidth: 35 }, // Status
        3: { cellWidth: 30 }, // Data
        4: { cellWidth: 35 }  // Valor
      },
      margin: { left: 20, right: 20 }
    });
  }

  /**
   * Adiciona resumo para múltiplos pedidos
   */
  private addMultipleOrdersSummary(doc: jsPDF, pedidos: IPedidos[], primaryColor: number[], textColor: number[]): void {
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Calcular estatísticas
    const totalPedidos = pedidos.length;
    const totalValue = pedidos.reduce((sum, pedido) => {
      const value = typeof pedido.totalPrice === 'string' 
        ? parseFloat(pedido.totalPrice.replace(',', '.')) || 0 
        : pedido.totalPrice || 0;
      return sum + value;
    }, 0);
    
    const statusCount = pedidos.reduce((acc, pedido) => {
      const status = pedido.status || 'Indefinido';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Título
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Geral', 20, finalY);
    
    // Caixa do resumo
    const boxY = finalY + 10;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.rect(20, boxY, 170, 60);
    
    // Valores
    doc.setFontSize(12);
    let currentY = boxY + 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total de Pedidos:', 30, currentY);
    doc.text(totalPedidos.toString(), 120, currentY);
    currentY += 12;
    
    doc.text('Valor Total:', 30, currentY);
    doc.text(this.formatCurrency(totalValue), 120, currentY);
    currentY += 15;
    
    // Status breakdown
    doc.setFontSize(10);
    doc.text('Status dos Pedidos:', 30, currentY);
    currentY += 8;
    
    Object.entries(statusCount).forEach(([status, count]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`• ${this.formatStatus(status)}: ${count}`, 35, currentY);
      currentY += 8;
    });
  }

  /**
   * Adiciona o resumo financeiro
   */
  private addResumoFinanceiro(doc: jsPDF, pedido: IPedidosRealizadosDetalhes, primaryColor: number[], textColor: number[]): void {
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Título
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 20, finalY);
    
    // Caixa do resumo
    const boxY = finalY + 10;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.rect(20, boxY, 170, 40);
    
    // Valores
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Valor Solicitado:', 30, boxY + 15);
    doc.text(this.formatCurrency(pedido.appTotalPrice), 120, boxY + 15);
    
    doc.text('Valor Aprovado:', 30, boxY + 30);
    doc.text(this.formatCurrency(pedido.totalPrice), 120, boxY + 30);
  }

  /**
   * Adiciona o rodapé
   */
  private addFooter(doc: jsPDF, secondaryColor: number[], pageNum?: number, totalPages?: number): void {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Linha separadora
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
    
    // Texto do rodapé
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Este documento foi gerado automaticamente pelo sistema.', 20, pageHeight - 20);
    doc.text('Em caso de dúvidas, entre em contato com seu fornecedor.', 20, pageHeight - 12);
    
    // Número da página
    const pageText = pageNum && totalPages ? `Página ${pageNum} de ${totalPages}` : 'Página 1 de 1';
    doc.text(pageText, pageWidth - 20, pageHeight - 20, { align: 'right' });
  }

  /**
   * Formata uma data para exibição
   */
  private formatDate(date: any): string {
    if (!date) return '-';
    
    if (typeof date === 'string') {
      // Se a data está no formato DD/MM/YYYY
      if (date.includes('/')) {
        return date;
      }
      // Se a data está em outro formato, tentar converter
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('pt-BR');
      }
    }
    
    if (date instanceof Date) {
      return date.toLocaleDateString('pt-BR');
    }
    
    return '-';
  }

  /**
   * Formata uma data para nome de arquivo
   */
  private formatDateForFileName(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}`;
  }

  /**
   * Formata o status para exibição
   */
  private formatStatus(status: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'APROVADO':
        return 'Aprovado';
      case 'CANCELADO':
        return 'Cancelado';
      case 'EM_ANALISE':
        return 'Em Análise';
      default:
        return status || '-';
    }
  }

  /**
   * Formata valores monetários
   */
  private formatCurrency(value: any): string {
    if (!value) return 'R$ 0,00';
    
    let numValue: number;
    
    if (typeof value === 'string') {
      // Remove caracteres não numéricos exceto vírgula e ponto
      const cleanValue = value.replace(/[^\d,.-]/g, '');
      // Substitui vírgula por ponto para conversão
      numValue = parseFloat(cleanValue.replace(',', '.'));
    } else {
      numValue = parseFloat(value);
    }
    
    if (isNaN(numValue)) return 'R$ 0,00';
    
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}