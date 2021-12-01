import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss'],
})
export class FlipCardComponent implements OnInit {
  flipped = false;

  constructor() { }

  ngOnInit() {}

  flip(event) {
    event.stopPropagation();
    this.flipped = !this.flipped;
  }
}
