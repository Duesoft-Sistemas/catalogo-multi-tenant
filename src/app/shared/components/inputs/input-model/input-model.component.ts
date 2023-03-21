import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Formularios } from 'src/app/shared/functions/formularios';

@Component({
  selector: 'app-input-model',
  templateUrl: './input-model.component.html',
  styleUrls: ['./input-model.component.css'],
})
export class InputModelComponent implements OnInit {
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() form!: FormGroup | any;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() type?: string;
  @Input() mask?: string;

  @Output() blur = new EventEmitter();
  formularios = Formularios;

  constructor() {}

  ngOnInit() {}
}
