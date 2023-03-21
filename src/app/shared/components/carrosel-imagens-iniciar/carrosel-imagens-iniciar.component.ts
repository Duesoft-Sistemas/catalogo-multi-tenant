import { Component, Input, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { CarroselImagens } from '../../classes/carrosel-imagens';

@Component({
  selector: 'app-carrosel-imagens-iniciar',
  templateUrl: './carrosel-imagens-iniciar.component.html',
  styleUrls: ['./carrosel-imagens-iniciar.component.css']
})
export class CarroselImagensIniciarComponent implements OnInit {
  timerSubs!: Subscription;
  @Input() imagens: CarroselImagens;
  exibirPlanoFundo :string [] = []
  constructor(){

  }

  private _indexImagemAtiva: number = 0;

  get indexImagemAtiva() {
    return this._indexImagemAtiva;
  }

  set indexImagemAtiva(value: number) {
    this._indexImagemAtiva =
      value < this.exibirPlanoFundo.length ? value : 0;
  }

  ngOnInit(): void {
    if(this.imagens != undefined){
      if(this.imagens.caminhoPlanoFundoCatalogo != null && this.imagens.caminhoPlanoFundoCatalogo != undefined)
        this.exibirPlanoFundo.push(this.imagens.caminhoPlanoFundoCatalogo);
          if(this.imagens.caminhoPlanoFundoCatalogo2 != null && this.imagens.caminhoPlanoFundoCatalogo2 != undefined)
          this.exibirPlanoFundo.push(this.imagens.caminhoPlanoFundoCatalogo2);
            if(this.imagens.caminhoPlanoFundoCatalogo3 != null && this.imagens.caminhoPlanoFundoCatalogo3 != undefined)
            this.exibirPlanoFundo.push(this.imagens.caminhoPlanoFundoCatalogo3);
    }
    this.iniciarTimer();
  }

  ngOnDestroy(): void {
    this.pararTimer();
  }

  iniciarTimer(): void {
    this.timerSubs = timer(1500).subscribe(() => {
      this.ativarImagem(
        this.indexImagemAtiva + 1
      );
    });
  }

  pararTimer(): void {
    this.timerSubs?.unsubscribe();
  }

  ativarImagem(index: number): void {
    this.indexImagemAtiva = index;
    this.iniciarTimer();
  }

}
