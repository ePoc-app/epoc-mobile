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

  @Output() onEndActivity = new EventEmitter<Array<{label: string, list: Array<string>}>>();

  cartesRestantes : Array<Response> = [];
  cartesTriees : Array<Response> = [];
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
    this.cartesRestantes.push(this.cartesTriees[this.cartesTriees.length - 1]);
    this.cartesTriees.pop();
    this.cartesRestantes.sort((card1, card2) => {
      if (card1.value < card2.value) {
        return -1
      } else if (card1.value === card2.value) {
        return 0;
      } else {
        return 1;
      }
    });
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
      if (this.cartesRestantes.length === 0) {
        const correctResponse: Array<{label: string, list: Array<string>}> = [];
        correctResponse.push({label: this.question.possibilities[0], list: this.cardsToTheLeft});
        correctResponse.push({label: this.question.possibilities[1], list: this.cardsToTheRight});
        this.onEndActivity.emit(correctResponse);
      }
    }
  }
}
