import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlterarSenhaComponent } from 'src/app/pages/alterar-senha/alterar-senha.component';
import { SeletorPeculiaridadesCatalogos } from '../../classes/seletor-peculiaridades-catalogos';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { TenantService } from '../../tenant/tenant.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  seletorPeculiaridadesCatalogos : SeletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(this.serviceTenant);
  caminhoLogo: string;

  constructor(
    private authStorageService: AuthStorageService,
    public dialog: MatDialog,
    private serviceTenant : TenantService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.habilitaIcone();
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
        element.classList.add('sidebar-collapse');
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
    if(this.seletorPeculiaridadesCatalogos.clientes.cliente7){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#brandLogo");
      centralizarLogoSideBar.classList.add('logoCanguru');
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
}
