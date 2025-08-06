import { Component, ElementRef, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlterarSenhaComponent } from 'src/app/pages/alterar-senha/alterar-senha.component';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { TenantService } from '../../tenant/tenant.service';
import { SeletorPeculiaridadesCatalogos } from '../../classes/seletor-peculiaridades-catalogos';
import { GlobalService } from '../../services/global.service';
import { Toaster } from '../../functions/toaster';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  seletorPeculiaridadesCatalogos : SeletorPeculiaridadesCatalogos;
  nomeEmpresa = '';
  spinner = false;
  sidebarAberto = false;
  isMobile = false;

  sidebarColapsada = true;

  menuItems = [
    { label: 'Início', link: 'inicio', icon: 'fas fa-home' },
    { label: 'Pesquisar Produtos', link: 'pesquisar-produtos', icon: 'fas fa-search' },
    { label: 'Fornecedores', link: 'fornecedores', icon: 'fas fa-dolly' },
    { label: 'Promoções', link: 'promocoes', icon: 'fas fa-percent' },
    { label: 'Lançamentos', link: 'lancamentos', icon: 'far fa-star' },
    { label: 'Pedidos Realizados', link: 'pedidos-realizados', icon: 'fas fa-clipboard-list' },
    { label: 'Concluir Pedido', link: 'concluir-pedido', icon: 'fas fa-cart-arrow-down' },
  ];

  constructor(
    private authStorageService: AuthStorageService,
    private serviceTenant : TenantService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private service: GlobalService,
    public router: Router
  ) {}

  ngOnInit() {
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(this.serviceTenant);
    this.habilitaIcone();
    
    // Verificar se é mobile
    this.checkIfMobile();
    
    // Buscar nome da empresa automaticamente quando a página carregar
    this.buscarNomeEmpresaAutomaticamente();
    
    // Iniciar monitoramento simples do sidebar
    this.iniciarMonitoramentoSimples();
    
    // Interceptar o comportamento do botão do menu no mobile
    this.interceptarBotaoMenu();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile(): void {
    // Incluir tablets no comportamento mobile (até 1024px)
    this.isMobile = window.innerWidth < 1024;
    
    // Se for mobile ou tablet, garantir que o sidebar não fique colapsado por padrão
    if (this.isMobile) {
      this.sidebarColapsada = false;
    }
  }

  sair(): void {
    this.authStorageService.logout();
    location.reload();
  }

  escondeMenu(): void {
    const element = document.getElementById('nav-body');
    if (element) {
      if (element.classList.contains('sidebar-open')) {
        element.classList.remove('sidebar-open');
        element.classList.add('sidebar-closed');
        
        // No mobile, não adicionar sidebar-collapse para manter o sidebar expandido
        if (!this.isMobile) {
          element.classList.add('sidebar-collapse');
        }
        
        this.sidebarAberto = false;
      }
    }
  }

  openModalAlterarSenha() {
    this.escondeMenu();
    this.dialog.open(AlterarSenhaComponent, {
      width: '350px'
    });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

  habilitaIcone() {
    this.seletorPeculiaridadesCatalogos.getTenant();
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente2){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#brandLogo");
      centralizarLogoSideBar.classList.add('logoCanguru');
    }else
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente4){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#brandLogo");
      centralizarLogoSideBar.classList.add('logoCanguru');
    }
    else
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente7){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#brandLogo");
      centralizarLogoSideBar.classList.add('logoCanguru');
    }
    else
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente3){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#imgLogo");
      centralizarLogoSideBar.classList.add('logoAutocar');
    }
  }

  getColor():string{
    var cor;
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente5)
     cor = '#ffffff';
    else
     cor = '';

    return cor;
  }

  getOpacidade():string{
    var opacidade;
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente5)
     opacidade = '0.9';
    else
     opacidade = '0.8';

    return opacidade;
  }

  // Monitoramento simples e estável do sidebar
  iniciarMonitoramentoSimples(): void {
    // Verificar a cada 1 segundo se o sidebar está aberto
    setInterval(() => {
      this.verificarSidebarSimples();
    }, 1000);
  }

  // Verificação simples do estado do sidebar
  verificarSidebarSimples(): void {
    const navBody = document.getElementById('nav-body');
    const sidebar = this.elementRef.nativeElement;
    
    let estaAberto = false;
    
    // Verificar nav-body primeiro
    if (navBody && navBody.classList.contains('sidebar-open')) {
      estaAberto = true;
    }
    // Verificar o próprio sidebar
    else if (sidebar) {
      const sidebarClasses = sidebar.className;
      if (sidebarClasses.includes('sidebar-open') || 
          sidebarClasses.includes('sidebar-expanded') ||
          sidebarClasses.includes('sidebar-hover') ||
          sidebarClasses.includes('open')) {
        estaAberto = true;
      }
    }
    
    // Atualizar apenas se mudou
    if (estaAberto !== this.sidebarAberto) {
      this.sidebarAberto = estaAberto;
      console.log('Estado do sidebar mudou para:', estaAberto);
    }
  }

  // Função para buscar o nome da empresa automaticamente
  buscarNomeEmpresaAutomaticamente(): void {
    // Verifica se o usuário está logado
    if (this.authStorageService.isLoggedIn()) {
      // Tenta buscar todas as empresas primeiro
      this.buscarTodasEmpresasAutomaticamente();
    }
  }

  // Função para buscar todas as empresas e pegar a primeira
  buscarTodasEmpresasAutomaticamente(): void {
    this.spinner = true;
    this.service
      .getAllCompanies()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data && data.length > 0) {
            // Pega o nome da primeira empresa encontrada
            this.nomeEmpresa = data[0].companyName;
            console.log('Nome da empresa carregado automaticamente:', this.nomeEmpresa);
          } else {
            console.log('Nenhuma empresa encontrada para carregamento automático');
          }
        },
        error: () => {
          console.log('Erro ao carregar empresa automaticamente');
        },
        complete: () => {
          this.spinner = false;
        },
    });
  }

  // Função para buscar o nome da empresa por CNPJ
  buscarNomeEmpresa(cnpj: string): void {
    if (!cnpj || cnpj.trim() === '') {
      this.nomeEmpresa = '';
      return;
    }

    this.spinner = true;
    this.service
      .getCompanies(cnpj)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          if (data && data.length > 0) {
            // Pega o nome da primeira empresa encontrada
            this.nomeEmpresa = data[0].companyName;
            console.log('Nome da empresa:', this.nomeEmpresa);
          } else {
            this.nomeEmpresa = '';
            console.log('Nenhuma empresa encontrada');
          }
        },
        error: () => {
          this.nomeEmpresa = '';
          console.log('Erro ao buscar empresa');
        },
        complete: () => {
          this.spinner = false;
        },
    });
  }

  // Função para limpar o nome da empresa
  limparNomeEmpresa(): void {
    this.nomeEmpresa = '';
  }

  interceptarBotaoMenu(): void {
    // Aguardar um pouco para garantir que o DOM esteja carregado
    setTimeout(() => {
      const botaoMenu = document.querySelector('[data-widget="pushmenu"]');
      if (botaoMenu) {
        botaoMenu.addEventListener('click', (event) => {
          if (this.isMobile) {
            event.preventDefault();
            event.stopPropagation();
            
            const navBody = document.getElementById('nav-body');
            if (navBody) {
              // No mobile, sempre abrir o sidebar completamente
              navBody.classList.remove('sidebar-collapse');
              navBody.classList.add('sidebar-open');
              navBody.classList.remove('sidebar-closed');
              this.sidebarAberto = true;
              this.sidebarColapsada = false;
            }
          }
        });
      }
    }, 100);
  }
}
