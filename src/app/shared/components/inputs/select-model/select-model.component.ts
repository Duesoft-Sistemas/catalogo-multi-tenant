import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Formularios } from 'src/app/shared/functions/formularios';

@Component({
  selector: 'app-select-model',
  templateUrl: './select-model.component.html',
  styleUrls: ['./select-model.component.css']
})
export class SelectModelComponent implements OnInit {
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() form!: FormGroup | any;
  @Input() list: any[];
  @Input() bindLabel?: string;
  @Input() bindValue?: string;
  @Input() addTagPromise?: boolean;
  @Input() loading?: boolean;
  @Input() multiple?: boolean;

  @Output() change = new EventEmitter();
  formularios = Formularios;
  constructor() {
    this.list = [];
  }

  ngOnInit() {
  }

}
