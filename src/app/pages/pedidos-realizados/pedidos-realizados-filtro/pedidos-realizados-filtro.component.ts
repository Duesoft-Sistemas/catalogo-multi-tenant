import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { FiltroPedidosRealizados } from 'src/app/shared/classes/filtro-pedidos-realizados';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Formularios } from 'src/app/shared/functions/formularios';
import { take } from 'rxjs';
import { Toaster } from 'src/app/shared/functions/toaster';

@Component({
  selector: 'app-pedidos-realizados-filtro',
  templateUrl: './pedidos-realizados-filtro.component.html',
  styleUrls: ['./pedidos-realizados-filtro.component.css'],
})
export class PedidosRealizadosFiltroComponent implements OnInit {
  formulario: FormGroup;
  listStatus: any[] = [];
  loadListStatus = true;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public filtro: any,
    private localeService: BsLocaleService,
    public dialog: MatDialog,
    private service: GlobalService
  ) {
    try {
      ptBrLocale.invalidDate = 'Insira uma data válida';
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');
      
      this.formulario = Formularios.geraFormulario(
        new FiltroPedidosRealizados(filtro)
      );
      
      this.getListaStatus();
    } catch (error) {
      console.error('Erro na inicialização do componente:', error);
      Toaster.Error('Erro ao inicializar filtro. Tente novamente.');
    }
  }

  buscar(): void {
    try {
      const formValues = this.formulario.value;
      
      // Validar se pelo menos um filtro foi preenchido
      const temFiltros = formValues.initialDate || formValues.finalDate || 
                        (formValues.status && formValues.status.length > 0);
      
      if (!temFiltros) {
        Toaster.Warning('Selecione pelo menos um critério de filtro.');
        return;
      }
      
      // Validar datas se foram preenchidas
      if (formValues.initialDate && formValues.finalDate) {
        const dataInicial = new Date(formValues.initialDate);
        const dataFinal = new Date(formValues.finalDate);
        
        if (dataInicial > dataFinal) {
          Toaster.Error('A data inicial não pode ser maior que a data final.');
          return;
        }
      }
      
      const filtroData = new FiltroPedidosRealizados(formValues);
      this.dialogRef.close(filtroData);
    } catch (error) {
      console.error('Erro ao criar filtro:', error);
      Toaster.Error('Erro ao processar filtro. Tente novamente.');
    }
  }

  limpar(): void {
    try {
      this.formulario = Formularios.geraFormulario(new FiltroPedidosRealizados());
      this.formulario.reset();
    } catch (error) {
      console.error('Erro ao limpar formulário:', error);
      Toaster.Error('Erro ao limpar formulário. Tente novamente.');
    }
  }

  private getListaStatus(): void {
    this.service
      .getStatusPedidos()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data && Array.isArray(data)) {
            this.listStatus = data;
            this.loadListStatus = false;
          } else {
            console.warn('Dados de status inválidos:', data);
            this.listStatus = [];
            this.loadListStatus = false;
            Toaster.Error(
              'Não foi possivel carregar lista de status de pedidos.'
            );
          }
        },
        error: (error) => {
          console.error('Erro ao carregar status:', error);
          this.listStatus = [];
          this.loadListStatus = false;
          Toaster.Error(Toaster.msg.ErroCarregarDados);
        },
      });
  }

  ngOnInit() {}

  getStatusColor(item: any): string {
    // Cores diferentes para diferentes status
    const statusColors: { [key: string]: string } = {
      'PENDENTE': '#f59e0b',      // Amarelo
      'APROVADO': '#10b981',      // Verde
      'REPROVADO': '#ef4444',     // Vermelho
      'CANCELADO': '#6b7280',     // Cinza
      'FINALIZADO': '#3b82f6',    // Azul
      'EM_PROCESSAMENTO': '#8b5cf6', // Roxo
      'ENVIADO': '#06b6d4',       // Ciano
      'ENTREGUE': '#059669'       // Verde escuro
    };
    
    return statusColors[item.description?.toUpperCase()] || '#6b7280';
  }
}
