import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  AfterViewInit
} from '@angular/core';
import {SwipCard} from '../../../../../../classes/contents/assessment';
import {GestureController, IonCard, Platform} from '@ionic/angular';

@Component({
  selector: 'app-swip-card',
  templateUrl: './swip-card.component.html',
  styleUrls: ['./swip-card.component.scss'],
})
export class SwipCardComponent implements AfterViewInit {
  @Input ('responses') responses: Array<string>;
  @Input ('SwipCard') swipCard: SwipCard;
  @Input('disabled') disabled: boolean;

  @Output() onSelectAnswer = new EventEmitter<string>();

  selectedAnswer;
  @ViewChildren(IonCard, {read:ElementRef}) card: ElementRef;

  constructor(private gestureCtrl: GestureController, private plt: Platform) { }

  ngAfterViewInit() {
    const swipCard = this.card;
    this.useSwipe(swipCard);
  }

  selectAnswer(answer) {
    if (this.responses.includes(answer)) {
      this.selectedAnswer = answer;
      this.onSelectAnswer.emit(this.selectedAnswer);
    }
  }
  useSwipe(card) {
    const gesture = this.gestureCtrl.create({
      el: card.nativeElement,
      gestureName: 'swipe',
      onStart: ev => {

      },
      onMove: ev => {
        card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
        // Change the title based on the deltaX
      },
      onEnd: ev => {
        card.nativeElement.style.transition = '0.5s ease-out';
        if (ev.deltaX > 150) {
          card.nativeElement.style.transform = `translateX(${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
        } else if (ev.deltaX < -150) {
          card.nativeElement.style.transform = `translateX(-${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`
        } else {
          card.nativeElement.style.transform = ``;
        }
      }
    });
  }
}
