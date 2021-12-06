import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss'],
})
export class FlipCardComponent implements OnInit {
  @Input() initFlipped: boolean;
  flipped = false;

  constructor() { }

  ngOnInit() {
    this.flipped = this.initFlipped;
  }

  flip() {
    this.flipped = !this.flipped;
  }

  showFront() {
    this.flipped = false;
  }

  showBack() {
    this.flipped = true;
  }
}
