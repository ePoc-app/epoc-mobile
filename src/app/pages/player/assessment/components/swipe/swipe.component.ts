import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Response, SwipeQuestion} from '../../../../../classes/contents/assessment';
import {animate, style, transition, trigger} from '@angular/animations';
import {ModalController} from '@ionic/angular';
import {ModalPage} from './swipe-modal/modal-page.component';

@Component({
  selector: 'swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
  animations: [
      trigger('slideIn', [
        transition(':enter', [
          style({opacity: 0, transform: 'translateY(100%)'}),
          animate('200ms 100ms ease-in', style({opacity: 1, transform: 'translateY(0%)'}))
        ])
      ])
  ]
})
export class SwipeComponent implements OnInit {

  @Input ('question') question: SwipeQuestion;
  @Input('disabled') disabled: boolean;
  @Input('correctionState') correctionState: boolean;
  @Output() onSelectAnswer = new EventEmitter<Array<Array<string>>>();

  cartesRestantes: Array<Response> = [];
  cartesTriees: Array<{response: Response, category: number, correct: boolean}> = [];
  cardsToTheLeft: Array<string> = [];
  cardsToTheRight: Array<string> = [];
  undoDisabled: boolean;

  // Modal
  correct: boolean;
  category: string;
  explanation: string;
  answer: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.cartesRestantes = this.question.responses.slice(0);
  }

  async swipeModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        correct: this.correct,
        category: this.category,
        explanation: this.explanation,
        answer: this.answer
      }
    });
    return await modal.present();
  }

  undo() {
    if (this.cartesTriees.length === 0){
      throw new Error('Array of cards swiped is empty');
    }
    const response = this.cartesTriees[this.cartesTriees.length - 1].response;
    this.cartesRestantes.push(response);
    if (this.cardsToTheLeft.includes(response.value)) {
      this.cardsToTheLeft.splice(this.cardsToTheLeft.indexOf(response.value), 1);
    } else {
      this.cardsToTheRight.splice(this.cardsToTheRight.indexOf(response.value), 1);
    }
    this.cartesTriees.pop();
    if (this.cartesRestantes.length === 1) {
      this.onSelectAnswer.emit();
    }
  }

  onAnimation(value: boolean) {
    this.undoDisabled = value;
  }

  onSelectSide(answer) {
    if (!this.question.possibilities.includes(this.question.possibilities[answer.category])) {
      throw new Error('Answer is not a possibility');
    } else {
      if (answer.category === 0) {
        this.cardsToTheLeft.push(answer.rep.value);
        this.cartesRestantes.pop();
      } else if (answer.category === 1) {
        this.cardsToTheRight.push(answer.rep.value);
        this.cartesRestantes.pop();
      }
      const correctedCard = {
        response: answer.rep,
        category: answer.category,
        correct: this.question.correctResponse[answer.category].values.includes(answer.rep.value)
      };
      this.cartesTriees.push(correctedCard);
      if (this.cartesRestantes.length <= 0) {
        this.onSelectAnswer.emit([this.cardsToTheLeft, this.cardsToTheRight]);
      }
    }
  }

  openPopUp(event, card) {
    event.stopPropagation();
    if (card.response.explanation) {
      this.correct = card.correct;
      this.category = this.question.possibilities[card.category];
      this.answer = card.correct?
          this.question.possibilities[card.category]:
          card.category === 0?
              this.question.possibilities[1]:
              this.question.possibilities[0];
      this.explanation = card.response.explanation;
      this.swipeModal().then();
    }
  }
}
