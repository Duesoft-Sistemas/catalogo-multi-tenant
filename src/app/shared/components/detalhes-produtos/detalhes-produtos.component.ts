import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeletorPeculiaridadesCatalogos } from '../../classes/seletor-peculiaridades-catalogos';
import { IProdutos } from '../../interface/IProdutos';
import { TenantService } from '../../tenant/tenant.service';

@Component({
  selector: 'app-detalhes-produtos',
  templateUrl: './detalhes-produtos.component.html',
  styleUrls: ['./detalhes-produtos.component.css']
})
export class DetalhesProdutosComponent implements OnInit {
  produto!: IProdutos;
  imgPadraoProduto = '../../../assets/images/imagem_nao_encontrada.jpg';
  imgPadraoMarca = '../../../assets/images/sem_foto.png';
  seletorPeculiaridadesCatalogos : SeletorPeculiaridadesCatalogos = new SeletorPeculiaridadesCatalogos(this.serviceTenant);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private serviceTenant: TenantService) {
    this.produto = data.detalhes;
    if(this.produto.completeDescription == '')
        this.produto.completeDescription = null;
    if(this.produto.observations == '')
        this.produto.observations = null;
  }

  ngOnInit() {
    this.seletorPeculiaridadesCatalogos.getTenant();
  }

  getPrice(price: any): number {
    return price.replace(',', '.') as number;
  }
}
