import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SwipeCard, SwipeQuestion} from '../../../../../classes/contents/assessment';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
})
export class SwipeComponent implements OnInit {

  @Input ('question') question: SwipeQuestion;
  @Output() onEndActivity = new EventEmitter<Array<string>>();

  cartesRestantes : Array<SwipeCard>;
  cartesTriees : Array<SwipeCard>;

  constructor() { }

  ngOnInit() {
    this.cartesRestantes = this.question.swipeCards;
  }

}
