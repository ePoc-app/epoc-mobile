import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  AfterViewInit, NgZone, ViewChild, NgModule, CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {SwipeCard} from '../../../../../../classes/contents/assessment';
import {GestureController, IonCard, Platform} from '@ionic/angular';
import {fromEvent, Observable} from "rxjs";

@Component({
  selector: 'swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss'],
})
export class SwipeCardComponent implements AfterViewInit {
  @Input ('responses') responses: Array<string>;
  @Input ('SwipeCard') swipeCard: SwipeCard;
  @Input('disabled') disabled: boolean;

  @Output() onSelectAnswer = new EventEmitter<string>();

  @ViewChild('card') card: ElementRef;

  selectedAnswer;

  constructor(private gestureCtrl: GestureController, private plt: Platform, private zone: NgZone) { }

  ngAfterViewInit() {
    this.useSwipe(this.card);
  }

  selectAnswer(answer) {
    if (!this.responses.includes(answer)) {
      throw new Error('Answer is not a possibility');
    }
    this.selectedAnswer = answer;
    this.onSelectAnswer.emit(this.selectedAnswer);
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
        card.nativeElement.style.transition = '1s ease-out';
        if (ev.deltaX > 150) {
          this.selectAnswer(this.responses[1]);
          card.nativeElement.style.transform = `translateX(${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
        } else if (ev.deltaX < -150) {
          this.selectAnswer(this.responses[0]);
          card.nativeElement.style.transform = `translateX(-${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
        } else {
          card.nativeElement.style.transform = ``;
          this.displayTitle(0);
        }
      }
    });
    gesture.enable(true);
  }
  displayTitle(deltaX) {
    const elt = document.getElementsByTagName('ion-card-title');
    const header = document.getElementById('header');

    if (deltaX > 0) {
      this.selectedAnswer = this.responses[0];
      header.style.background='#92BBAF';
    } else if (deltaX < 0) {
      this.selectedAnswer = this.responses[1];
      header.style.background='#FFCE20';
    } else {
      this.selectedAnswer = '';
      header.style.background='transparent';
    }
    elt[0].innerHTML = this.selectedAnswer;
  }
}
