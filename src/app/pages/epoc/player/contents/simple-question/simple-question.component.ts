import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';
import {Reading} from 'src/app/classes/reading';
import {Content} from 'src/app/classes/contents/content';
import {CommonQuestionComponent} from 'src/app/components/questions/common-question/common-question.component';

@Component({
    selector: 'simple-question',
    templateUrl: './simple-question.component.html',
    styleUrls: ['./simple-question.component.scss'],
})
export class SimpleQuestionComponent {
    @Input() content: Content;
    @Input() question: Question;
    @Input() epocId: string;
    @Output() dragging = new EventEmitter<string>();

    @ViewChild(CommonQuestionComponent, { static: false })
    private questionComponent!: CommonQuestionComponent;

    reading: Reading;
    questionAnswered = false;
    disableCheck = true;

    constructor() {}

    checkAnswer(event) {
        event.preventDefault();
        event.stopPropagation();
        this.questionComponent.calcScore();
    }

    onQuestionAnswered (event) {
        this.questionAnswered = event;
    }

    onDrag(value){
        this.dragging.emit(value);
    }

    onUserHasResponded (event) {
        this.disableCheck = !event;
    }
}
