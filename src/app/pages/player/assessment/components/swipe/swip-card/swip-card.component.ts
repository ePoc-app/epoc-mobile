import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SwipCard} from '../../../../../../classes/contents/assessment';

@Component({
  selector: 'app-swip-card',
  templateUrl: './swip-card.component.html',
  styleUrls: ['./swip-card.component.scss'],
})
export class SwipCardComponent implements OnInit {
  @Input ('responses') responses: Array<string>;
  @Input ('SwipCard') swipCard: SwipCard;
  @Input('disabled') disabled: boolean;

  @Output() onSelectAnswer = new EventEmitter<string>();

  selectedAnswer;

  constructor() { }

  ngOnInit() {}

  selectAnswer(answer) {
  }
}
