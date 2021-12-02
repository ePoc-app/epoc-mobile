import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss'],
})
export class FlipCardComponent implements OnInit {
  flipped = false;

  constructor() { }

  ngOnInit() {}

  flip() {
    this.flipped = !this.flipped;
  }
}
