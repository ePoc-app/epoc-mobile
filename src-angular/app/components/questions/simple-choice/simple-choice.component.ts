import {Component, Input, OnInit} from '@angular/core';
import {SimpleChoiceQuestion} from 'src/app/classes/contents/assessment';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
    selector: 'simple-choice',
    templateUrl: './simple-choice.component.html',
    styleUrls: ['./simple-choice.component.scss'],
})
export class SimpleChoiceComponent extends AbstractQuestionComponent implements OnInit{

    @Input() question: SimpleChoiceQuestion;

    selectedAnswer;

    constructor() {
        super();
    }

    ngOnInit() {
        if (this.userPreviousResponse && this.userPreviousResponse.length > 0) {
            this.selectedAnswer = this.userPreviousResponse[0];
        }
    }

    selectAnswer(answer) {
        this.selectedAnswer = answer;
        this.userResponse.emit([this.selectedAnswer]);
    }
}
