import { Component, DoCheck } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthStorageService } from '../../guards/auth-storage.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck {
  userNameCatalogo: string | null = null;
  autenticado = false;
  urlImg = 'assets/images/users-icon.png';

  constructor(private storage: AuthStorageService, public dialog: MatDialog) {}

  ngDoCheck() {
    if (localStorage.getItem('tokenCatalogo')) {
      this.userNameCatalogo = localStorage.getItem('userNameCatalogo');
      const img = localStorage.getItem('logoCatalogo');
      this.urlImg = img && img !== 'null' ? `data:image/jpeg;base64,${img}` : this.urlImg;
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
    return this.storage.getTitlePage();
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
