import { IFormularios } from "../interface/IFormularios";

export class FiltroPedidosRealizados implements IFormularios{
  initialDate: Date;
  finalDate: Date;
  status: string[];
  page: number;
  pageSize: number;

  constructor(values?: any){
    if (values) {
      this.initialDate = values.initialDate || null;
      this.finalDate = values.finalDate || null;
      this.status = values.status || [];
      this.page = values.page || 1;
      this.pageSize = values.pageSize || 10;
    } else {
      this.initialDate = null;
      this.finalDate = null;
      this.status = [];
      this.page = 1;
      this.pageSize = 10;
    }
  }

  getValidators() {
    return [];
  }

  getFiltro(): any {
    // Se não há filtros aplicados, retorna null para buscar todos
    if (!this.initialDate && !this.finalDate && (!this.status || this.status.length === 0)) {
      return null;
    }

    const filtroData = {
      initialDate: this.initialDate
        ? this.formatDate(this.initialDate)
        : null,
      finalDate: this.finalDate
        ? this.formatDate(this.finalDate)
        : null,
      status: this.status && Array.isArray(this.status) && this.status.length > 0 
        ? this.status.filter(s => s !== null && s !== undefined && s !== '')
        : null,
      page: this.page || 1,
      pageSize: this.pageSize || 10
    };
    
    return filtroData;
  }

  private formatDate(date: Date | string): string {
    if (!date) return null;
    
    try {
      let dateObj: Date;
      
      if (typeof date === 'string') {
        // Se já está no formato brasileiro (dd/mm/yyyy)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          const [day, month, year] = date.split('/');
          dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Se está no formato ISO (yyyy-mm-dd)
        else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          dateObj = new Date(date);
        }
        // Se está no formato brasileiro com hífen (dd-mm-yyyy)
        else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
          const [day, month, year] = date.split('-');
          dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Tenta o formato padrão do JavaScript
        else {
          dateObj = new Date(date);
        }
      } else {
        dateObj = date;
      }
      
      // Verifica se a data é válida
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida:', date);
        return null;
      }
      
      // Retorna no formato brasileiro (dd/mm/yyyy)
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error, 'Data original:', date);
      return null;
    }
  }

  // Método para debug
  toString(): string {
    return `FiltroPedidosRealizados {
      initialDate: ${this.initialDate},
      finalDate: ${this.finalDate},
      status: ${JSON.stringify(this.status)},
      page: ${this.page},
      pageSize: ${this.pageSize}
    }`;
  }
}
