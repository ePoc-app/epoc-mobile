import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'multiple-choice',
    templateUrl: '../multiple-choice/multiple-choice.component.html',
    styleUrls: ['../multiple-choice/multiple-choice.component.scss'],
})
export class MultipleChoiceComponent {

    @Input('question') question: Question;
    @Input('disabled') disabled: boolean;
    @Output() onSelectAnswer = new EventEmitter<any>();

    selectedAnswers = [];

    constructor() {}

    selectAnswer(answer) {
        const index = this.selectedAnswers.indexOf(answer.detail.value);
        if (answer.detail.checked && index === -1) {
            this.selectedAnswers.push(answer.detail.value);
        } else {
            if (index >= 0) {
                this.selectedAnswers.splice(index, 1);
            }
        }

        this.onSelectAnswer.emit(this.selectedAnswers);
    }
}
