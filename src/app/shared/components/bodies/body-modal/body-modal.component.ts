import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-body-modal',
  templateUrl: './body-modal.component.html',
  styleUrls: ['./body-modal.component.css']
})
export class BodyModalComponent implements OnInit {
  @Input() spinner?: boolean;
  @Input() title?: string;
  @Input() subTitle?: string;
  @Input() crud?: boolean|any = null;
  @Input() update?: boolean;

  constructor() { }

  ngOnInit() {
  }

}
