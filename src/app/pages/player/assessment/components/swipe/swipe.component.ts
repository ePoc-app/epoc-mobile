import {Component, Input, OnInit, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SwipeCard, SwipeQuestion} from '../../../../../classes/contents/assessment';
import {fromEvent, Observable} from "rxjs";

@Component({
  selector: 'swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
})
export class SwipeComponent implements OnInit {

  @Input ('question') question: SwipeQuestion;
  @Input('disabled') disabled: boolean;

  @Output() onEndActivity = new EventEmitter<Array<string>>();

  cartesRestantes : Array<SwipeCard>;
  cartesTriees : Array<SwipeCard>;
  responses: Array<string>;

  constructor() { }

  ngOnInit() {
    this.cartesRestantes = this.question.swipeCards;
  }

  undo() {
    if (this.cartesTriees.length === 0){
      throw new Error('Array of cards left is empty');
    }
    this.cartesRestantes.push(this.cartesTriees[this.cartesTriees.length - 1]);
    this.cartesTriees.pop();
    this.cartesRestantes.sort((card1, card2) => {
      if (card1.id < card2.id) {
        return -1
      } else if (card1.id === card2.id) {
        return 0;
      } else {
        return 1;
      }
    });
    }

  onSelectAnswer(answer) {
    if (this.question.responses.includes(answer)) {
      this.responses.push(answer);
    }
    if (this.cartesRestantes.length === 0) {
      this.onEndActivity.emit(this.responses);
    }
  }
}
