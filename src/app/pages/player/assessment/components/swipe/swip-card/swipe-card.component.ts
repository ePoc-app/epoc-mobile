import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit, NgZone, ViewChild
} from '@angular/core';
import {GestureController, Platform} from '@ionic/angular';
import {Response} from '../../../../../../classes/contents/assessment';

@Component({
  selector: 'swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss'],
})
export class SwipeCardComponent implements AfterViewInit {
  @Input ('possibilities') possibilities: Array<string>;
  @Input ('response') response: Response;
  @Input('disabled') disabled: boolean;

  @Output() onSelectSide = new EventEmitter<{ rep:Response, category:string }>();

  @ViewChild('card', {read:ElementRef}) card: ElementRef

  selectedSide;

  constructor(private gestureCtrl: GestureController, private plt: Platform, private zone: NgZone) { }

  ngAfterViewInit() {
    this.useSwipe();
  }

  selectSide(side) {
    if (!this.possibilities.includes(side)) {
      throw new Error('Answer is not a possibility');
    }
    this.selectedSide = side;
    this.onSelectSide.emit({rep:this.response, category:side});
  }
  useSwipe() {
    const gesture = this.gestureCtrl.create({
      el: this.card.nativeElement,
      gestureName: 'swipe',
      onMove: ev => {
        this.card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
        // On utilise la zone d'angular pour réactualiser le titre à chaque fois qu'on bouge.
        // Dans cette fonction, on mettra le changement de couleur en fct de deltaX aussi
        this.zone.run(() => {
          this.displayTitle(ev.deltaX);
        })
      },
      onEnd: ev => {
        this.card.nativeElement.style.transition = '0.5s ease-out';
        if (ev.deltaX > 150) {
          this.selectSide(this.possibilities[1]);
          this.card.nativeElement.style.transform = `translateX(${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
        } else if (ev.deltaX < -150) {
          this.selectSide(this.possibilities[0]);
          this.card.nativeElement.style.transform = `translateX(-${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
        } else {
          this.card.nativeElement.style.transform = ``;
          this.displayTitle(0);
        }
      }
    });
    gesture.enable(true);
  }
  displayTitle(deltaX) {
    const title = document.getElementsByTagName('ion-card-title');
    const header = document.getElementsByTagName('ion-card-header');

    if (deltaX > 0) {
      this.selectedSide = this.possibilities[0];
      header[0].style.background='#92BBAF';
    } else if (deltaX < 0) {
      this.selectedSide = this.possibilities[1];
      header[0].style.background='#FFCE20';
    } else {
      this.selectedSide = '';
      header[0].style.background='transparent';
    }
    title[0].innerHTML = this.selectedSide;
  }
}
