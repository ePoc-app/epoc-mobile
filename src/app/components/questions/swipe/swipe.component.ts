import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Response, SwipeQuestion} from 'src/app/classes/contents/assessment';
import {animate, style, transition, trigger} from '@angular/animations';
import {AnimationController, ModalController, Platform} from '@ionic/angular';
import {ModalPage} from './swipe-modal/modal-page.component';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
  selector: 'swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
  animations: [
    trigger('undoAnimations', [
      transition('void => rightToLeft', [
        style({transform:`translateX(${500}px) rotate(${50}deg)`}),
        animate('300ms ease-out', style({transform:`none`}))
      ]),
      transition('void => leftToRight', [
        style({transform:`translateX(${-500}px) rotate(${-50}deg)`}),
        animate('300ms ease-out', style({transform:`none`}))
      ]),
    ])
  ]
})
export class SwipeComponent extends AbstractQuestionComponent implements OnInit{

  @Input () question: SwipeQuestion;

  cardsSorted: Array<{response: Response, category: number, correct: boolean}> = [];
  // Arrays to loop on when in correction mode
  cardsSortedToLeft: Array<{response: Response, correct: boolean}> = [];
  cardsSortedToRight: Array<{response: Response, correct: boolean}> = [];

  // Array to loop on when in normal mode
  cardsRemaining: Array<Response> = [];

  // Sent to parent
  answersToTheLeft: Array<string> = [];
  answersToTheRight: Array<string> = [];

  // Related to animation
  animationState: string;
  undoDisabled: boolean;

  // Modal
  correct: boolean;
  category: string;
  explanation: string;
  answer: string;

  constructor(public modalController: ModalController, public animationController: AnimationController, private plt: Platform) {
    super();
  }

  ngOnInit() {
    const shuffleArray = arr => arr
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);
    this.cardsRemaining = shuffleArray(this.question.responses);
    this.question.possibilities = this.question.correctResponse.map(response => response.label);
  }

  fillCorrectionArray(solutionShown: boolean) {
    if (solutionShown) {
      this.cardsSortedToLeft = [];
      this.cardsSortedToRight = [];
      this.question.correctResponse[0].values.forEach((value) => {
        this.cardsSortedToLeft.push({
          response: this.question.responses.find(response => response.value === value),
          correct: true
        });
      })
      this.question.correctResponse[1].values.forEach((value) => {
        this.cardsSortedToRight.push({
          response: this.question.responses.find(response => response.value === value),
          correct: true
        });
      })
    } else {
      this.cardsSortedToLeft = [];
      this.cardsSortedToRight = [];
      this.cardsSorted.forEach((card) => {
        if (card.category === 0) {
          this.cardsSortedToLeft.push(card);
        } else if (card.category === 1) {
          this.cardsSortedToRight.push(card);
        }
      })
    }
  }

  startAnimation(state) {
    this.animationState = state;
  }

  undo() {
    if (this.cardsSorted.length === 0){
      throw new Error('Array of cards swiped is empty');
    }
    const response = this.cardsSorted[this.cardsSorted.length - 1].response;
    this.cardsRemaining.push(response);
    if (this.answersToTheLeft.includes(response.value)) {
      this.answersToTheLeft.splice(this.answersToTheLeft.indexOf(response.value), 1);
    } else {
      this.answersToTheRight.splice(this.answersToTheRight.indexOf(response.value), 1);
    }
    if (this.cardsSorted[this.cardsSorted.length -1].category === 0) {
      this.startAnimation('leftToRight');
    } else if (this.cardsSorted[this.cardsSorted.length - 1].category === 1) {
      this.startAnimation('rightToLeft');
    }
    this.cardsSorted.pop();
    if (this.cardsRemaining.length === 1) {
      this.userResponse.emit();
    }
  }

  onAnimation(event) {
    this.undoDisabled = event.disabled;
    this.startAnimation(event.anim);
  }

  onSelectSide(answer) {
    if (!this.question.possibilities.includes(this.question.possibilities[answer.category])) {
      throw new Error('Answer is not a possibility');
    } else {
      if (answer.category === 0) {
        this.answersToTheLeft.push(answer.rep.value);
        this.cardsRemaining.pop();
      } else if (answer.category === 1) {
        this.answersToTheRight.push(answer.rep.value);
        this.cardsRemaining.pop();
      }
      const correctedCard = {
        response: answer.rep,
        category: answer.category,
        correct: this.question.correctResponse[answer.category].values.includes(answer.rep.value)
      };
      this.cardsSorted.push(correctedCard);
      if (this.cardsRemaining.length <= 0) {
        this.fillCorrectionArray(false);
        this.userResponse.emit([this.answersToTheLeft, this.answersToTheRight]);
      }
    }
  }
}
