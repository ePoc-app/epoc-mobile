import {Component, Input, OnInit} from '@angular/core';
import {MultipleChoiceQuestion} from 'src/app/classes/contents/assessment';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
    selector: 'multiple-choice',
    templateUrl: '../multiple-choice/multiple-choice.component.html',
    styleUrls: ['../multiple-choice/multiple-choice.component.scss'],
})
export class MultipleChoiceComponent extends AbstractQuestionComponent implements OnInit {

    @Input() question: MultipleChoiceQuestion;

    // Array to loop on
    selectedAnswers = [];

    constructor() {
        super();
    }

    ngOnInit() {
        if (this.userPreviousResponse && this.userPreviousResponse.length > 0) {
            this.selectedAnswers = this.userPreviousResponse;
        }
    }

    selectAnswer(answer) {
        const index = this.selectedAnswers.indexOf(answer.detail.value);
        if (answer.detail.checked && index === -1) {
            this.selectedAnswers.push(answer.detail.value);
        } else {
            if (index >= 0) {
                this.selectedAnswers.splice(index, 1);
            }
        }
        this.userResponse.emit(this.selectedAnswers);
    }
}
