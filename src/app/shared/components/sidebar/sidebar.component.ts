import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlterarSenhaComponent } from 'src/app/pages/alterar-senha/alterar-senha.component';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { TenantService } from '../../tenant/tenant.service';
import { SeletorPeculiaridadesCatalogos } from '../../classes/seletor-peculiaridades-catalogos';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  seletorPeculiaridadesCatalogos : SeletorPeculiaridadesCatalogos;

  constructor(
    private authStorageService: AuthStorageService,
    private serviceTenant : TenantService,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(this.serviceTenant);
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
}
