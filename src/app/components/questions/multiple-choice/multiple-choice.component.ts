import {Component, Input} from '@angular/core';
import {MultipleChoiceQuestion} from 'src/app/classes/contents/assessment';
import {AbstractActivityContainerComponent} from '../abstract-activity-container.component';

@Component({
    selector: 'multiple-choice',
    templateUrl: '../multiple-choice/multiple-choice.component.html',
    styleUrls: ['../multiple-choice/multiple-choice.component.scss'],
})
export class MultipleChoiceComponent extends AbstractActivityContainerComponent {

    @Input() question: MultipleChoiceQuestion;

    // Array to loop on
    selectedAnswers = [];

    // Used in html to display values
    selectValue = [];
    selectClass = [];

    constructor() {
        super();
    }

    updateDisplay(correctionState: boolean, solutionShown: boolean) {
            if (!correctionState) {
                this.selectHeader = '';
                this.selectClass = [];
                this.selectValue = [];
                return;
            } else {
                if (!solutionShown) {
                    this.selectHeader = '';
                    this.question.responses.forEach((response) => {
                        this.selectClass[this.question.responses.indexOf(response)] = this.selectedAnswers.includes(response.value) ?
                            (this.question.correctResponse.includes(response.value) ? 'correct' : 'incorrect') : '';
                        this.selectValue[this.question.responses.indexOf(response)] = this.selectedAnswers.includes(response.value);
                    })
                } else {
                    this.question.responses.forEach((response) => {
                        this.selectClass[this.question.responses.indexOf(response)] =
                            this.question.correctResponse.includes(response.value) ? 'correct' : '';
                        this.selectHeader = 'Solution';
                        this.selectValue[this.question.responses.indexOf(response)] =
                            this.question.correctResponse.includes(response.value);
                    })
                }
            }
    }

    selectAnswer(answer) {
        if (!this.correctionState) {
            const index = this.selectedAnswers.indexOf(answer.detail.value);
            if (answer.detail.checked && index === -1) {
                this.selectedAnswers.push(answer.detail.value);
            } else {
                if (index >= 0) {
                    this.selectedAnswers.splice(index, 1);
                }
            }
            this.onUserResponse.emit(this.selectedAnswers);
        }
        this.updateDisplay(this.correctionState, this.solutionShown);
    }
}
