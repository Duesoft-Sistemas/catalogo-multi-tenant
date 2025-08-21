import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-products-found',
  templateUrl: './no-products-found.component.html',
  styleUrls: ['./no-products-found.component.css']
})
export class NoProductsFoundComponent {
  @Input() message: string = 'Nenhum produto encontrado';
  @Input() showIcon: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() customDescription: string = 'Tente ajustar os filtros ou termos de pesquisa';
}
