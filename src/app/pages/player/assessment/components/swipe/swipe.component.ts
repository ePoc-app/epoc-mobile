import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Response, SwipeQuestion} from '../../../../../classes/contents/assessment';

@Component({
  selector: 'swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
})
export class SwipeComponent implements OnInit {

  @Input ('question') question: SwipeQuestion;
  @Input('disabled') disabled: boolean;

  @Output() onSelectAnswer = new EventEmitter<Array<{label: string, values: Array<string>}>>();

  cartesRestantes: Array<Response> = [];
  cartesTriees: Array<Response> = [];
  cardsToTheLeft: Array<string> = [];
  cardsToTheRight: Array<string> = [];

  constructor() { }

  ngOnInit() {
    this.cartesRestantes = this.question.responses;
  }

  undo() {
    if (this.cartesTriees.length === 0){
      throw new Error('Array of cards swiped is empty');
    }
    const response = this.cartesTriees[this.cartesTriees.length - 1];
    this.cartesRestantes.push(response);
    if (this.cardsToTheLeft.includes(response.value)) {
      this.cardsToTheLeft.splice(this.cardsToTheLeft.indexOf(response.value), 1);
    } else {
      this.cardsToTheRight.splice(this.cardsToTheRight.indexOf(response.value), 1);
    }
    this.cartesTriees.pop();
  }

  onSelectSide(answer) {
    if (!this.question.possibilities.includes(answer.category)) {
      throw new Error('Answer is not a possibility');
    } else {
      if (answer.category === this.question.possibilities[0]) {
        this.cardsToTheLeft.push(answer.rep.value);
        this.cartesTriees.push(answer.rep);
        this.cartesRestantes.pop();
      } else if (answer.category === this.question.possibilities[1]) {
        this.cardsToTheRight.push(answer.rep.value);
        this.cartesTriees.push(answer.rep);
        this.cartesRestantes.pop();
      }
      if (this.cartesRestantes.length <= 0) {
        this.onSelectAnswer.emit([
          {label: this.question.possibilities[0], values: this.cardsToTheLeft},
          {label: this.question.possibilities[1], values: this.cardsToTheRight}
        ]);
      }
    }
  }
}
