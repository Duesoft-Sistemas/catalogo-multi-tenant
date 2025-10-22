import { Component, DoCheck, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { SeletorPeculiaridadesCatalogos } from '../../classes/seletor-peculiaridades-catalogos';
import { TenantService } from '../../tenant/tenant.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck, OnInit {
  userNameCatalogo: string | null = null;
  autenticado = false;
  urlImg = 'assets/images/users-icon.png';
  seletorPeculiaridadesCatalogos : SeletorPeculiaridadesCatalogos;
  currentTitle: string = '';

  constructor(
    private storage: AuthStorageService, 
    private serviceTenant: TenantService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.seletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(this.serviceTenant);
  }

  ngOnInit(): void {
    this.habilitaIcone();
    this.updateTitle();
  }

  private habilitaIcone() {
    this.seletorPeculiaridadesCatalogos.getTenant();  
  }

  ngDoCheck() {
    if (localStorage.getItem('tokenCatalogo')) {
      this.userNameCatalogo = localStorage.getItem('userNameCatalogo');
      const img = localStorage.getItem('logoCatalogo');
      this.urlImg = img && img !== 'null' ? `data:image/jpeg;base64,${img}` : this.urlImg;
    }
    
    // Atualizar título se necessário
    const newTitle = this.storage.getTitlePage();
    if (newTitle && newTitle !== this.currentTitle) {
      this.currentTitle = newTitle;
      this.cdr.detectChanges();
    }
  }

  openModalConfirm() {
    const dialogRef = this.dialog
      .open(ModalConfirmComponent, {
        width: '300px',
        data: { title: 'Deseja sair do sistema ?' },
      })
      .updatePosition({ top: '100px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.storage.logout();
    });
  }

  reload(): void {
    location.reload();
  }

  getTitlePage(): string {
    return this.currentTitle;
  }

  private updateTitle(): void {
    this.currentTitle = this.storage.getTitlePage() || '';
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
