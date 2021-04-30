import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  AfterViewInit, NgZone
} from '@angular/core';
import {SwipeCard} from '../../../../../../classes/contents/assessment';
import {GestureController, IonCard, Platform} from '@ionic/angular';

@Component({
  selector: 'app-swip-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss'],
})
export class SwipeCardComponent implements AfterViewInit {
  @Input ('responses') responses: Array<string>;
  @Input ('SwipeCard') swipeCard: SwipeCard;
  @Input('disabled') disabled: boolean;

  @Output() onSelectAnswer = new EventEmitter<string>();

  selectedAnswer;
  @ViewChildren(IonCard, {read:ElementRef}) card: ElementRef;

  constructor(private gestureCtrl: GestureController, private plt: Platform, private zone: NgZone) { }

  ngAfterViewInit() {
    const swipeCard = this.card;
    this.useSwipe(swipeCard);
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
      onMove: ev => {
        card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
        // On utilise la zone d'angular pour réactualiser le titre à chaque fois qu'on bouge.
        // Dans cette fonction, on mettra le changement de couleur en fct de deltaX aussi
        this.zone.run(() => {
          this.displayTitle(ev.deltaX);
        })
      },
      onEnd: ev => {
        card.nativeElement.style.transition = '0.5s ease-out';
        if (ev.deltaX > 150) {
          this.selectAnswer(this.responses[1]);
          card.nativeElement.style.transform = `translateX(${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
        } else if (ev.deltaX < -150) {
          this.selectAnswer(this.responses[0]);
          card.nativeElement.style.transform = `translateX(-${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`
        } else {
          card.nativeElement.style.transform = ``;
        }
      }
    });
    gesture.enable(true);
  }
  displayTitle(deltaX) {
    const elt = document.getElementsByTagName('ion-card-title');
    if (deltaX > 0) {
      this.selectedAnswer = this.responses[1];
      elt[0].style.background='#92BBAF';
    } else if (deltaX < 0) {
      this.selectedAnswer = this.responses[0];
      elt[0].style.background='#FFCE20';
    } else {
      this.selectedAnswer = '';
    }
  }
}
