import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'simple-choice',
    templateUrl: './simple-choice.component.html',
    styleUrls: ['./simple-choice.component.scss'],
})
export class SimpleChoiceComponent {

    @Input('question') question: Question;
    @Input('questionMeta') questionMeta: {index: number, total: number};
    @Output() onSelectAnswer = new EventEmitter<string>();

    selectedAnswer;

    constructor() {}

    selectAnswer(answer) {
        this.selectedAnswer = answer;
        this.onSelectAnswer.emit(this.selectedAnswer);
    }
}
