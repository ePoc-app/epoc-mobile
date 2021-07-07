import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SimpleChoiceQuestion} from '../../../../../classes/contents/assessment';
import {AbstractActivityContainerComponent} from '../../abstract-activity-container.component';

@Component({
    selector: 'simple-choice',
    templateUrl: './simple-choice.component.html',
    styleUrls: ['./simple-choice.component.scss'],
})
export class SimpleChoiceComponent extends AbstractActivityContainerComponent implements OnChanges {

    @Input('question') question: SimpleChoiceQuestion;

    selectedAnswer;
    selectValue;

    constructor() {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.solutionShown && changes.solutionShown.currentValue) {
            this.updateDisplay(changes.solutionShown.currentValue);
        } else if (changes.solutionShown && changes.solutionShown.currentValue === false) {
            this.updateDisplay(changes.solutionShown.currentValue);
        }
    }

    selectAnswer(answer) {
        this.selectedAnswer = answer;
        this.onSelectAnswer.emit([this.selectedAnswer]);
    }

    updateDisplay(solutionShown: boolean) {
        if (solutionShown) {
            this.selectValue = this.question.correctResponse;
            this.selectHeader = 'Solution';
        } else {
            this.selectValue = this.selectedAnswer;
            this.selectHeader = '';
        }
    }
}
