import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-model',
  templateUrl: './checkbox-model.component.html',
  styleUrls: ['./checkbox-model.component.css']
})
export class CheckboxModelComponent implements OnInit {
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() form!: FormGroup | any;
  @Input() labelTrue!: string;
  @Input() labelFalse!: string;
  @Input() switch?: boolean = true;
  @Input() index?: number;

  constructor() {
    this.index = 0;
  }

  ngOnInit() {
  }
}
