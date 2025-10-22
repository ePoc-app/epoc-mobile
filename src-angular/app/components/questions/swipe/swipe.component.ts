import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import {SwipeQuestion} from 'src/app/classes/contents/assessment';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AnimationController, GestureController} from '@ionic/angular';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
    selector: 'swipe',
    templateUrl: './swipe.component.html',
    styleUrls: ['./swipe.component.scss'],
    animations: [
        trigger('undoAnimations', [
            transition('void => rightToLeft', [
                style({transform: `translateX(${500}px) rotate(${50}deg)`}),
                animate('300ms ease-out', style({transform: `none`}))
            ]),
            transition('void => leftToRight', [
                style({transform: `translateX(${-500}px) rotate(${-50}deg)`}),
                animate('300ms ease-out', style({transform: `none`}))
            ]),
        ]),
        trigger('swipeAnimations', [
            state('initial', style({transform: '{{transform}}'}),  {params: {transform: 'none'}}),
            state('swipeLeft', style({transform: `translateX(-100vh) rotate(-50deg)`})),
            state('swipeRight', style({transform: `translateX(100vh) rotate(50deg)`})),
            transition('initial => swipeLeft', animate('300ms ease-in')),
            transition('initial => swipeRight', animate('300ms ease-in')),
            transition('* => initial', animate('300ms ease-out'))
        ])
    ]
})
export class SwipeComponent extends AbstractQuestionComponent implements OnInit, AfterViewInit {

    @Input() question: SwipeQuestion;
    @Output() dragging = new EventEmitter<string>();
    @ViewChildren('swipeCards') swipeCards:QueryList<ElementRef>;

    sides: Array<string>;

    cardsRemaining: Array<{label:string, value:string, selectedSide:string, animationState: string, transform: string}> = [];
    cardsSorted: Array<{label:string, value:string, selectedSide:string, animationState: string, transform: string}> = [];

    // Sent to parent
    answersToTheLeft: Array<{label:string,value:string}> = [];
    answersToTheRight: Array<{label:string,value:string}> = [];

    // Related to animation
    animationState: string;
    undoDisabled: boolean;
    isDragging = false;

    constructor(
        public animationController: AnimationController,
        private ref: ChangeDetectorRef,
        private gestureCtrl: GestureController
    ) {
        super();
    }

    ngOnInit() {
        const shuffleArray = arr => arr
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
        if (!this.userPreviousResponse) {
            this.cardsRemaining = shuffleArray(this.question.responses).map(response => {
                return {...response, animationState: 'initial', transform: 'none'}
            });
        }
        this.sides = this.question.correctResponse.map(response => response.label);
    }

    ngAfterViewInit() {
        if (!this.swipeCards) return;
        this.initSwipe();
    }

    initSwipe(){
        const threshold = window.innerWidth / 3;
        const thresholdVelocity = 0.4;
        this.swipeCards.forEach((card, index) => {
            const elem = card.nativeElement;
            const swipeCard = this.cardsRemaining[index];
            const gesture = this.gestureCtrl.create({
                el: elem,
                threshold: 0,
                gestureName: 'swipe',
                onStart: () => {
                    this.isDragging = true;
                    this.dragging.emit('dragstart');
                    elem.style.transition = 'none';
                    this.ref.detectChanges();
                },
                onMove: ev => {
                    swipeCard.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
                    if (ev.deltaX > 0) {
                        swipeCard.selectedSide = this.sides[0];
                    } else if (ev.deltaX < 0) {
                        swipeCard.selectedSide = this.sides[1];
                    }
                    this.ref.detectChanges();
                },
                onEnd: ev => {
                    this.isDragging = false;
                    this.dragging.emit('dragend');
                    if (ev.deltaX > threshold || ev.velocityX > thresholdVelocity) {
                        this.startAnimation(swipeCard, 'swipeRight');
                    } else if (ev.deltaX < -threshold || ev.velocityX < -thresholdVelocity) {
                        this.startAnimation(swipeCard, 'swipeLeft');
                    } else {
                        elem.style.transition = 'transform .3s ease-in-out';
                        swipeCard.transform = 'none';
                        swipeCard.selectedSide = null;
                    }
                    this.ref.detectChanges();
                },
            });

            gesture.enable();
        })
    }

    startAnimation(swipeCard, animationState) {
        swipeCard.animationState = animationState;
    }

    animationDone(event) {
        if (['swipeRight','swipeLeft'].indexOf(event.toState) !== -1 && event.fromState === 'initial') {
            this.selectSide(event.toState);
        }
    }

    undo() {
        if (!this.cardsSorted.length) return;
        const lastCardSorted = this.cardsSorted.pop();
        if(lastCardSorted.animationState === 'swipeRight') {
            this.answersToTheLeft.pop();
        } else if (lastCardSorted.animationState === 'swipeLeft') {
            this.answersToTheRight.pop();
        }
        this.cardsRemaining.push(lastCardSorted);
        this.ref.detectChanges();
        lastCardSorted.animationState = 'initial';
        lastCardSorted.transform = 'none';
        lastCardSorted.selectedSide = null;
        this.initSwipe();
        this.userResponse.emit(null);
    }

    swipe(side){
        if(side === 'swipeRight') {
            this.cardsRemaining[this.cardsRemaining.length-1].selectedSide = this.sides[0];
        } else if (side === 'swipeLeft') {
            this.cardsRemaining[this.cardsRemaining.length-1].selectedSide = this.sides[1];
        }
        if(this.cardsRemaining.length > 0) this.startAnimation(this.cardsRemaining[this.cardsRemaining.length-1], side);
    }

    selectSide(side) {
        if (!this.cardsRemaining.length) return;
        const sortedCard = this.cardsRemaining.pop();
        this.cardsSorted.push(sortedCard);
        if(side === 'swipeRight') {
            this.answersToTheLeft.push({label:sortedCard.label,value:sortedCard.value});
        } else if (side === 'swipeLeft') {
            this.answersToTheRight.push({label:sortedCard.label,value:sortedCard.value});
        }

        if (this.cardsRemaining.length === 0) {
            this.userResponse.emit([this.answersToTheLeft, this.answersToTheRight]);
        }
    }
}
