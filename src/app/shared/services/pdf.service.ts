import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IPedidosRealizadosDetalhes } from '../interface/IPedidosRealizadosDetalhes';
import { style } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class PedidoPdfService {

  constructor() {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }

  private async getBase64FromUrl(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      
      console.log(url)

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();

      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch(err) {
        console.error("Deu o seguinte erro ao buscar URL da empresa: " + err)
      return null;
    }
  }

  async gerarPedidoPDF(dados: IPedidosRealizadosDetalhes) {
    //const logoBase64 = await this.getBase64FromUrl(dados.logoEmpresa);

    const docDefinition = {
      images: {
        logo: ""
      },
      pageMargins: [30, 30, 30, 30],

      if (logoBase64) {
        docDefinition.images.logo = logoBase64;
      },

      content: [
        {
          columns: [
           // logoBase64
            // { image: 'logo', width: 80 }
            //:{ image: '', width: 80 },
            {
              stack: [
                { text: dados.company, style: 'company' },
                { text: 'PEDIDO DE VENDA / SEPARAÇÃO', style: 'title' }
              ],
              alignment: 'left'
            },
            {
              stack: [
                { text: dados.status, style: 'status' },
                { text: `Pedido Nº ${dados.solicitationNumber}`, style: 'pedido', with: 20 }
              ],
              alignment: 'right'
            }
          ]
        },

        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 535,
              h: 2,
              color: '#E3F2FD'
            }
          ],
          margin: [0, 10, 0, 15]
        },

        {
          columns: [
            [
              { text: `Cliente: ${dados.nameCli}`, style: 'info' },
              { text: `Código Cliente: ${dados.codCli} / ERP: ${dados.erpCodCli}`, style: 'info' },
              { text: `E-mail: ${dados.emailCli}`, style: 'info' }
            ],
            [
              { text: `Data do Pedido: ${dados.orderDate}`, style: 'info', alignment: 'right' },
              //{ text: `Pedido ERP: ${dados.orderNumber ?? '-'}`, style: 'info', alignment: 'right' }
            ]
          ],
          margin: [0, 0, 0, 15]
        },

        {
          table: {
            headerRows: 1,
            widths: ['*', 50, 40, 80],
            body: [
              [
                { text: 'Produto', style: 'tableHeader' },
                { text: 'Qtd', style: 'tableHeader', alignment: 'center' },
                { text: 'Un', style: 'tableHeader', alignment: 'center' },
                { text: 'Total', style: 'tableHeader', alignment: 'right' }
              ],
              ...dados.itens.map(i => [
              `${i.code} - ${i.description.length > 35 
              ? i.description.substring(0, 35) + '...' 
              : i.description}`,
              { text: i.appQtd, alignment: 'center' },
              { text: i.unity, alignment: 'center' },
              { text: `R$ ${i.appTotalPrice}`, alignment: 'right' }
              ])
            ]
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? '#E3F2FD' : null,
            hLineColor: () => '#E0E0E0',
            vLineColor: () => '#E0E0E0'
          },
          margin: [0, 0, 0, 15]
        },

        {
          columns: [
            { text: `Total de Itens: ${dados.itens.length}`, style: 'total' },
            { text: `Valor Total: R$ ${dados.appTotalPrice}`, style: 'total', alignment: 'right' }
          ],
          margin: [0, 0, 0, 20]
        },

        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'Separado por:', style: 'check' },
                { text: 'Conferido por:', style: 'check' },
                { text: 'Data:', style: 'check' }
              ],
              [' ', ' ', ' ']
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],

      styles: {
        company: {
          fontSize: 12,
          bold: true,
          color: '#0D47A1'
        },
        title: {
          fontSize: 14,
          bold: true,
          color: '#0D47A1'
        },
        status: {
          fontSize: 11,
          bold: true,
          color: '#1565C0'
        },
        pedido: {
          fontSize: 10,
          color: '#424242'
        },
        info: {
          fontSize: 10,
          color: '#424242',
          margin: [0, 2, 0, 2]
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          color: '#0D47A1'
        },
        total: {
          fontSize: 11,
          bold: true,
          color: '#0D47A1'
        },
        check: {
          fontSize: 10,
          bold: true,
          color: '#424242'
        }
      },

      defaultStyle: {
        fontSize: 9
      }
    };
    
    pdfMake.createPdf(docDefinition).download(
      `pedido_${dados.solicitationNumber}.pdf`
    );
  }
}
