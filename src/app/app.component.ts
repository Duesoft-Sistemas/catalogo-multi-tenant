import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SeletorPeculiaridadesCatalogos } from './shared/classes/seletor-peculiaridades-catalogos';
import { Tenant, TenantService } from './core/tenant/tenant.service';
import { AuthStorageService } from './core/guards/auth-storage.service';
import { environment } from '../environments/environment';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'catalogo-multi-tenant-continuando-refatoracao';
  autenticado = false;

  constructor(
    private router: Router,
    private serviceTenant: TenantService,
    private cdr: ChangeDetectorRef,
    public authStorageService: AuthStorageService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    console.log('🚀 AppComponent ngOnInit iniciado');
    this.verificarAutenticacao();
    
    // Aplicar tema com delay para garantir que o DOM esteja pronto
    setTimeout(() => {
      this.aplicarTemaLocal();
    }, 100);
    
    // Configurar controle de scroll para modais
    this.configurarControleScrollModais();
    
    // Verificar se os componentes estão sendo carregados
    setTimeout(() => {
      console.log('🔍 Verificando componentes após 2 segundos...');
      const header = document.querySelector('app-header');
      const sidebar = document.querySelector('app-sidebar');
      console.log('Header encontrado:', !!header);
      console.log('Sidebar encontrado:', !!sidebar);
      console.log('Estado autenticado:', this.autenticado);
    }, 2000);

    // Tornar métodos acessíveis globalmente para debug
    (window as any).appComponent = this;
    console.log('🔧 Para testar temas, use: appComponent.testarTema("fase") ou appComponent.testarTema("mendes")');
  }

  private configurarControleScrollModais() {
    // Observar mudanças no DOM para detectar quando modais são abertos/fechados
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const overlayContainer = document.querySelector('.cdk-overlay-container');
          if (overlayContainer) {
            const hasModals = overlayContainer.children.length > 0;
            if (hasModals) {
              // Modal aberto - bloquear scroll da página
              document.body.style.overflow = 'hidden';
              document.body.style.position = 'fixed';
              document.body.style.width = '100%';
              document.body.style.top = `-${window.scrollY}px`;
            } else {
              // Modal fechado - restaurar scroll da página
              const scrollY = document.body.style.top;
              document.body.style.overflow = '';
              document.body.style.position = '';
              document.body.style.width = '';
              document.body.style.top = '';
              if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
              }
            }
          }
        }
      });
    });

    // Observar mudanças no body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Também verificar periodicamente para garantir que funcione
    setInterval(() => {
      const overlayContainer = document.querySelector('.cdk-overlay-container');
      if (overlayContainer) {
        const hasModals = overlayContainer.children.length > 0;
        if (hasModals && document.body.style.overflow !== 'hidden') {
          // Modal aberto mas scroll não bloqueado
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `-${window.scrollY}px`;
        } else if (!hasModals && document.body.style.overflow === 'hidden') {
          // Modal fechado mas scroll ainda bloqueado
          const scrollY = document.body.style.top;
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        }
      }
    }, 100);
  }

  private aplicarTemaLocal() {
    const tenant = this.serviceTenant.getTenant();
    console.log('🔍 Tenant detectado no aplicarTemaLocal:', tenant);
    console.log('🔍 URL atual:', window.location.href);
    console.log('🔍 Hostname:', window.location.hostname);
    let schema = '';
    let titulo = '';
    let favicon = '';

    switch (tenant) {
      case 'catalogomendes':
        schema = 'mendes';
        titulo = "Catálogo Mendes";
        favicon = 'duesoft.ico';
        break;
      case 'catalogocanguru':
        schema = 'canguru';
        titulo = "Catálogo Canguru";
        favicon = 'favicon.ico';
        console.log('🦘 Aplicando tema Canguru');
        break;
      case 'catalogomicrotec':
        schema = 'microtec';
        titulo = "Catálogo Microtec";
        favicon = 'duesoft.ico';
        break;
      case 'catalogomm':
        schema = 'mm';
        titulo = "Catálogo MM";
        favicon = 'duesoft.ico';
        break;
      case 'catalogoprudenseg':
        schema = 'prudenseg';
        titulo = "Catálogo Prudenseg";
        favicon = 'duesoft.ico';
        break;
      case 'catalogolm':
        schema = 'diskagua';
        titulo = "Catálogo Disk água";
        favicon = 'duesoft.ico';
        break;
      case 'catalogoprudentina':
        schema = 'prudentina';
        titulo = "Prudentina";
        favicon = 'duesoft.ico';
        break;
      case 'catalogobarone':
        schema = 'barone';
        titulo = "Barone";
        favicon = 'faviconBarone.png';
        break;
      case 'catalogoatacado':
        schema = 'atacado';
        titulo = "Atacado";
        favicon = 'Atacado.ico';
        break;
      case 'catalogofarmsrugs':
        schema = 'farmsrugs';
        titulo = "Farms Rugs";
        favicon = 'farms_rugs2.ico';
        break;
      case 'catalogohvs':
        schema = 'hvs';
        titulo = "Hvs";
        favicon = 'hvs.ico';
        break;
      case 'catalogofarms':
        schema = 'southair';
        titulo = "Farms Catalog";
        favicon = 'farms2.ico';
        break;
      case 'catalogoclx':
        schema = 'clx';
        titulo = "CLX";
        favicon = 'clx.ico';
        break;
      case 'catalogoawsmetal':
        schema = 'awsmetal';
        titulo = "Aws Metal & Mecânica";
        favicon = 'aws_metal.ico';
        break;
      case 'catalogoteste':
        schema = 'teste';
        titulo = "Catalogo Teste";
        favicon = 'duesoft.ico';
        break;
      case 'catalogofrigorichter':
        schema = 'frigorichter';
        titulo = "Catalogo Frigorichter";
        favicon = 'duesoft.ico';
        break;
      case 'catalogofase':
        schema = 'fase';
        titulo = "Catalogo Fase";
        favicon = 'fase.ico';
        console.log('🎨 Mapeamento correto: catalogofase -> fase');
        break;
      default:
        schema = 'fase';
        titulo = "Catalogo Fase";
        favicon = 'fase.ico';
        console.log('🎨 Mapeamento padrão: fase');
        break;
    }

    // Aplicar título e favicon
    document.title = titulo;
    this.setFavicon(favicon);
    
    // Aplicar o tema usando o ThemeService
    if (schema) {
      this.themeService.applyTheme(schema);
      console.log('🎨 Tema aplicado com sucesso:', schema);
    }
  }

  private setFavicon(faviconName: string) {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = `assets/${faviconName}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  private verificarAutenticacao() {
    // Verificar se há token no localStorage usando o AuthStorageService
    this.autenticado = this.authStorageService.isLoggedIn();
    console.log('🔐 Estado de autenticação inicial:', this.autenticado);
    
    // Adicionar listener para mudanças no localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === environment.idLocalStorage) {
        this.autenticado = this.authStorageService.isLoggedIn();
        console.log('🔄 Mudança detectada no localStorage:', this.autenticado);
        this.cdr.detectChanges();
      }
    });
    
    // Verificar periodicamente para mudanças locais
    setInterval(() => {
      const currentAuth = this.authStorageService.isLoggedIn();
      if (this.autenticado !== currentAuth) {
        this.autenticado = currentAuth;
        console.log('🔄 Mudança detectada na verificação periódica:', this.autenticado);
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  // Método público para forçar verificação de autenticação
  public verificarAutenticacaoForcada() {
    this.autenticado = this.authStorageService.isLoggedIn();
    console.log('🔍 Verificação forçada de autenticação:', this.autenticado);
    this.cdr.detectChanges();
  }

  // Método público para forçar aplicação do tema
  public aplicarTemaForcado() {
    console.log('🎨 Forçando aplicação do tema...');
    this.aplicarTemaLocal();
  }

  // Método para testar tema específico (pode ser chamado via console)
  public testarTema(schema: string) {
    console.log(`🎨 Testando tema: ${schema}`);
    this.themeService.applyTheme(schema);
    
    // Verificar se foi aplicado
    setTimeout(() => {
      const bodyClasses = document.body.classList.toString();
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
      console.log('📋 Classes do body:', bodyClasses);
      console.log('🎨 Cor primária:', primaryColor);
      console.log('✅ Tema aplicado:', bodyClasses.includes(`theme-${schema}`));
    }, 200);
  }
}
