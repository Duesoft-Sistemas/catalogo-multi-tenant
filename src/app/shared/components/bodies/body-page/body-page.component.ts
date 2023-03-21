import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-body-page',
  templateUrl: './body-page.component.html',
  styleUrls: ['./body-page.component.css'],
})
export class BodyPageComponent implements OnInit {
  @Input() spinner?: boolean;
  @Input() title: string;
  @Input() update: boolean;
  @Input() showBody: boolean;
  @Input() showFooter: boolean;

  constructor() {
    this.showBody = true;
    this.showFooter = false;
  }

  ngOnInit() {}
}
