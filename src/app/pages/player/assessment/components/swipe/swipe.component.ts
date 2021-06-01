import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Response, SwipeQuestion} from '../../../../../classes/contents/assessment';
import {animate, style, transition, trigger} from '@angular/animations';
import {AnimationController, ModalController, Platform} from '@ionic/angular';
import {ModalPage} from './swipe-modal/modal-page.component';

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
export class SwipeComponent implements OnInit, OnChanges {

  @Input ('question') question: SwipeQuestion;
  @Input('correctionState') correctionState: boolean;
  @Input('solutionShown') solutionShown: boolean;

  @Output() onSelectAnswer = new EventEmitter<Array<Array<string>>>();

  cardsSorted: Array<{response: Response, category: number, correct: boolean}> = [];
  // Arrays to loop on when in correction mode
  cardsSortedToLeft: Array<{response: Response, correct: boolean}> = [];
  cardsSortedToRight: Array<{response: Response, correct: boolean}> = [];

  // Array to loop on when in normal mode
  cardsRemaining: Array<Response> = [];

  // Used in html to display values
  nbCorrect: number;
  selectHeader: string;

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

  constructor(public modalController: ModalController, public animationController: AnimationController, private plt: Platform) {}

  ngOnInit() {
    this.nbCorrect = 0;
    this.correctionState = false;
    this.solutionShown = false;
    const shuffleArray = arr => arr
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);
    this.cardsRemaining = shuffleArray(this.question.responses);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.correctionState && changes.correctionState.currentValue) {
      this.updateDisplay(changes.correctionState.currentValue, this.solutionShown);
    } else if (changes.correctionState && changes.correctionState.currentValue === false) {
      this.updateDisplay(changes.correctionState.currentValue, this.solutionShown);
    }
    if (changes.solutionShown && changes.solutionShown.currentValue) {
      this.updateDisplay(this.correctionState, changes.solutionShown.currentValue);
    } else if (changes.solutionShown && changes.solutionShown.currentValue === false) {
      this.updateDisplay(this.correctionState, changes.solutionShown.currentValue);
    }
  }

  updateDisplay(correctionState: boolean, solutionShown: boolean) {
      if (!correctionState) {
        this.selectHeader = 'Glissez la carte à gauche ou à droite';
      } else {
        this.fillCorrectionArray(solutionShown);
        if (!solutionShown) {
          this.selectHeader = this.nbCorrect + ' / ' + this.question.responses.length + ' réponses justes';
        } else {
          this.selectHeader = 'Solution';
        }
      }
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
    if (this.cardsSorted[this.cardsSorted.length -1].correct){
      this.nbCorrect -= 1;
    }
    if (this.cardsSorted[this.cardsSorted.length -1].category === 0) {
      this.startAnimation('leftToRight');
    } else if (this.cardsSorted[this.cardsSorted.length - 1].category === 1) {
      this.startAnimation('rightToLeft');
    }
    this.cardsSorted.pop();
    if (this.cardsRemaining.length === 1) {
      this.onSelectAnswer.emit();
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
      if (correctedCard.correct) {
        this.nbCorrect += 1;
      }
      this.cardsSorted.push(correctedCard);
      if (this.cardsRemaining.length <= 0) {
        this.fillCorrectionArray(false);
        this.onSelectAnswer.emit([this.answersToTheLeft, this.answersToTheRight]);
      }
    }
  }

  openPopUp(event, card) {
    event.stopPropagation();
    if (!card.response.explanation || this.solutionShown) {
      return;
    }
    this.correct = card.correct;
    this.category = this.question.possibilities[card.category];
    this.answer = card.correct?
        this.question.possibilities[card.category]:
        card.category === 0?
            this.question.possibilities[1]:
            this.question.possibilities[0];
    this.explanation = card.response.explanation;

    const x = event.currentTarget.getBoundingClientRect().left;
    const y = event.currentTarget.getBoundingClientRect().top;
    const cardWidth = event.currentTarget.getBoundingClientRect().width;
    const cardHeight = event.currentTarget.getBoundingClientRect().height;

    const offsetX = -(this.plt.width()/2 - x) + cardWidth/2;
    const offsetY = -(this.plt.height()/2 - y) + cardHeight/2;

    // Animations
    const popupEnterAnimation = (baseEl: HTMLElement) => {
      const backdropAnimation = this.animationController.create()
          .addElement(baseEl.querySelector('ion-backdrop'))
          .fromTo('opacity', '0.1', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationController.create()
          .addElement(baseEl.querySelector('.modal-wrapper'))
          .from('opacity','1')
          .fromTo('borderRadius','4em', '0')
          .fromTo('transform',
              `translate3d(${offsetX}px, ${offsetY}px, 0) scaleX(0.1) scaleY(0.1)`,
              'translate3d(0, 0, 0) scaleX(1) scaleY(1)');

      return this.animationController.create()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const popupLeaveAnimation = (baseEl: any) => {
      return popupEnterAnimation(baseEl).direction('reverse');
    }
    this.modalController.create({
      component: ModalPage,
      mode : 'ios',
      cssClass: 'swipe-modal',
      componentProps: {
        correct: this.correct,
        category: this.category,
        explanation: this.explanation,
        answer: this.answer
      },
      enterAnimation: popupEnterAnimation,
      leaveAnimation: popupLeaveAnimation
    }).then((modal) => {
      modal.present();
    });
  }
}
