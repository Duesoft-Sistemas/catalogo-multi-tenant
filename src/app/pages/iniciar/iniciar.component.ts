import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { take } from 'rxjs';
import { PesquisaEsteiraClass } from 'src/app/shared/classes/pesquisa-esteira-class';
import { SeletorImagemCatalogo } from 'src/app/shared/classes/seletor-imagem-catalogo';
import { FiltroProdutosComponent } from 'src/app/shared/components/filtro-produtos/filtro-produtos.component';
import { KeyboardKey } from 'src/app/shared/enums/keyboard-key.enum';
import { Formularios } from 'src/app/shared/functions/formularios';
import { Toaster } from 'src/app/shared/functions/toaster';
import { AuthStorageService } from 'src/app/shared/guards/auth-storage.service';
import { IProdutos } from 'src/app/shared/interface/IProdutos';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Tenant, TenantService } from 'src/app/shared/tenant/tenant.service';
import { FiltroPesquisaAvancada } from './modal-pesquisa-avancada/filtro-pesquisa-avancada';
import { ModalPesquisaAvancadaComponent } from './modal-pesquisa-avancada/modal-pesquisa-avancada.component';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.component.html',
  styleUrls: ['./iniciar.component.scss'],
})
export class IniciarComponent implements OnInit {

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: any) {
    if (this.listProdutos.length <= 0) {
      if (
        event.code === KeyboardKey.Enter ||
        event.code === KeyboardKey.EnterNumpad
      ) {
        if (event.target.id === 'inputSearchDescricao')
          this.buscaProdutosPorDescricao();
        // else this.pesquisarProdutos();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  innerWidth: any;
  spinner = false;
  planoFundo: string;
  filtroPesquisaAvancada = FiltroPesquisaAvancada;
  imageSrc = "";
  formEsteira: FormGroup;
  descricao: string;
  bgStyle: any;
  listProdutos: IProdutos[] = [];
  caminhoLogo: string;
  seletorImagemLogo : SeletorImagemCatalogo = new SeletorImagemCatalogo(this.serviceTenant);

  constructor(
    private service: GlobalService,
    private serviceTenant: TenantService,
    private storage: AuthStorageService,
    private router: Router,
    public dialog: MatDialog
  ) {
    let data = this.storage.getDataStorage();
    this.bgStyle = data.planoFundo;
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.limpar();
      }
    });
  }

  ngOnInit(): void {
    this.habilitaPlanoFundo();
    this.innerWidth = window.innerWidth;
    this.storage.setTitlePage('Início');
    this.formEsteira = Formularios.geraFormulario(new PesquisaEsteiraClass());
  }

  limpar(): void {
    this.listProdutos = [];
    this.formEsteira = Formularios.geraFormulario(new PesquisaEsteiraClass());
  }

  private getDataBusca(): any {
    this.descricao = this.descricao?.trim() ?? '';
    this.descricao = this.descricao.toUpperCase();

    return { Code: this.descricao, Page: +this.formEsteira.get('page').value };
  }

  buscaProdutosPorDescricao(): void {
    this.spinner = true;
    this.service
      .getProdutosPesquisa(this.getDataBusca())
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.listProdutos = data.produtos;
            this.formEsteira.get('totalPages').setValue(data.totalPaginas);
            if (data.produtos.lenght <= 0)
              Toaster.Warning('Nenhum produto encontrado.');
          } else Toaster.Warning('Nenhum produto encontrado.');
        },
        error: (error) => {
          Toaster.Error('Nenhum produto encontrado.');
          this.spinner = false;
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }

  openModalPesquisaAvancada(): void {
    const dialogRef = this.dialog.open(ModalPesquisaAvancadaComponent, {
      width: '548px',
      data: {
        filtro: this.filtroPesquisaAvancada,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.produtos) {
          this.listProdutos = result.produtos;
          this.formEsteira.get('totalPages').setValue(result.totalPaginas);
        }
        if (result.filtro.flag) {
          this.filtroPesquisaAvancada = result.filtro;
        } else {
          this.filtroPesquisaAvancada.flag = false;
        }
      }
    });
  }

  openModalFiltro(): void {
    const dialogRef = this.dialog.open(FiltroProdutosComponent, {
      data: {
        width: '200px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.descricao = result.code;
        this.buscaProdutosPorDescricao();
      }
    });
  }
  private habilitaPlanoFundo() {
    this.seletorImagemLogo.getImagem();
    if(this.seletorImagemLogo.clientes.cliente1){
      this.caminhoLogo = "Fundo_Mendes.jpeg"
    }
    if(this.seletorImagemLogo.clientes.cliente2){
      this.caminhoLogo = "CatalogoMasterFundo.png"
    }this.seletorImagemLogo.clientes.cliente1
    if(this.seletorImagemLogo.clientes.cliente3){
      this.caminhoLogo = "autocar.jpg"
    }
    if(this.seletorImagemLogo.clientes.cliente4){
      this.caminhoLogo = "microtec_logo.png"
    }
    if(this.seletorImagemLogo.clientes.cliente5){
      this.caminhoLogo = "mmdistribuidora.png"
    }
    if(this.seletorImagemLogo.clientes.cliente6){
      this.caminhoLogo = "logo_prudenseg.png"
    }
    if(this.seletorImagemLogo.clientes.cliente7){
      this.caminhoLogo = "esguicho-dagua.png"
    }
  }

  goTo(event: PageChangedEvent): void {
    this.formEsteira.get('page').setValue(event.page);
    this.buscaProdutosPorDescricao();
  }
}


