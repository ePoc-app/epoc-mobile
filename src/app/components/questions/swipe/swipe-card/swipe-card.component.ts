import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit, NgZone, ViewChild
} from '@angular/core';
import {GestureController, Platform} from '@ionic/angular';
import {Response} from 'src/app/classes/contents/assessment';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss'],
  animations: [
    trigger('swipeAnimations', [
      state('initial', style({
        transform: '*'
      })),
      state('swipeLeft', style({transform:`translateX(${-500}px) rotate(${-50}deg)`})),
      state('swipeRight', style({transform:`translateX(${500}px) rotate(${50}deg)`})),
      transition('initial => swipeLeft', animate('300ms ease-in')),
      transition('initial => swipeRight', animate('300ms ease-in')),
    ])
  ]
})

export class SwipeCardComponent implements AfterViewInit {
  @Input ('possibilities') possibilities: Array<string>;
  @Input ('response') response: Response;
  @Input('disabled') disabled: boolean;
  @Input('correct') correct: boolean;
  @Input('selectedSide') selectedSide: string;
  @Input('solutionShown') solutionShown: boolean;

  @Output() onSelectSide = new EventEmitter<{rep: Response, category: number}>();
  @Output() onAnimationRunning = new EventEmitter<boolean>();
  @ViewChild('card', {read:ElementRef}) card: ElementRef

  animationState = 'initial';

  constructor(
      private gestureCtrl: GestureController,
      private zone: NgZone,
      private platform: Platform
  ) { }

  ngAfterViewInit() {
    if (!this.disabled){
      this.useSwipe();
    }
    if (this.correct !== undefined) {
      const header = this.card.nativeElement.querySelector('ion-card-header');
      if (this.selectedSide === this.possibilities[0]) {
        this.setBackgroundColor(header, '#FFCE20');
      } else {
        this.setBackgroundColor(header, '#92BBAF');
      }
    }
  }

  startAnimation(newState) {
    this.zone.run(() => {
      this.onAnimationRunning.emit(true);
      this.animationState = newState;
    })
  }

  animationDone(event) {
    if(event.fromState === 'swipeRight') {
      this.selectSide(1);
    } else if (event.fromState === 'swipeLeft') {
      this.selectSide(0);
    }
    this.onAnimationRunning.emit(false);
    this.animationState = 'initial';
  }

  selectSide(side: number) {
    if (!this.possibilities.includes(this.possibilities[side])) {
      throw new Error('Answer is not a possibility');
    }
    this.selectedSide = this.possibilities[side];
    this.onSelectSide.emit({rep:this.response, category:side});
  }
  useSwipe() {
    const threshold = window.innerWidth / 3;
    const thresholdVelocity = 0.4;
    const gesture = this.gestureCtrl.create({
      el: this.card.nativeElement,
      gestureName: 'swipe',
      onStart: () => {
        this.card.nativeElement.style.transition = 'none';
      },
      onMove: ev => {
        this.card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
        // On utilise la zone d'angular pour réactualiser le titre à chaque fois qu'on bouge.
        // Dans cette fonction, on mettra le changement de couleur en fct de deltaX aussi
        this.zone.run(() => {
          this.displayTitle(ev.deltaX, this.card.nativeElement);
        })
      },
      onEnd: ev => {
        this.card.nativeElement.style.transition = '0.3s ease-out';
        if (ev.deltaX > threshold || ev.velocityX > thresholdVelocity) {
          this.startAnimation('swipeRight');
        } else if (ev.deltaX < -threshold || ev.velocityX < -thresholdVelocity) {
          this.startAnimation('swipeLeft');
        } else {
          this.card.nativeElement.style.transform  = ``;
          this.displayTitle(0, this.card.nativeElement);
        }
      }
    });
    gesture.enable(true);
  }

  displayTitle(deltaX, cardElement) {
    const title = cardElement.querySelector('ion-card-title');
    const header = cardElement.querySelector('ion-card-header');

    if (deltaX > 0) {
      this.setSelectedSide(this.possibilities[1]);
      this.setBackgroundColor(header, '#92BBAF');
    } else if (deltaX < 0) {
      this.setSelectedSide(this.possibilities[0]);
      this.setBackgroundColor(header, '#FFCE20');
    } else {
      this.setSelectedSide('?');
      this.setBackgroundColor(header, 'transparent');
    }
    title.innerHTML = this.selectedSide;
  }

  setBackgroundColor(elem, color: string) {
    elem.style.background = color;
  }

  setSelectedSide(side: string) {
    this.selectedSide = side;
  }
}


