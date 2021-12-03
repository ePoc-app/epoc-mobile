import {Component, Input, ViewChild} from '@angular/core';
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

    @ViewChild(CommonQuestionComponent, { static: false })
    private questionComponent!: CommonQuestionComponent;

    reading: Reading;
    answerChecked = false;

    constructor() {}

    checkAnswer(event) {
        event.preventDefault();
        event.stopPropagation();
        this.questionComponent.checkAnswer();
        this.answerChecked = true;
    }
}
