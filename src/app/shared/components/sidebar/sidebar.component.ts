import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlterarSenhaComponent } from 'src/app/pages/alterar-senha/alterar-senha.component';
import { SeletorImagemCatalogo } from '../../classes/seletor-imagem-catalogo';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { TenantService } from '../../tenant/tenant.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  seletorImagemLogo : SeletorImagemCatalogo = new SeletorImagemCatalogo(this.serviceTenant);
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
    this.seletorImagemLogo.getImagem();
    if(this.seletorImagemLogo.clientes.cliente2){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#brandLogo");
      centralizarLogoSideBar.classList.add('logoCanguru');
    }else
    if(this.seletorImagemLogo.clientes.cliente7){
      var centralizarLogoSideBar = this.elementRef.nativeElement.querySelector("#brandLogo");
      centralizarLogoSideBar.classList.add('logoCanguru');
    }
  }
}
