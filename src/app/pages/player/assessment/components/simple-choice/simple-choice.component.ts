import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'simple-choice',
    templateUrl: './simple-choice.component.html',
    styleUrls: ['./simple-choice.component.scss'],
})
export class SimpleChoiceComponent implements OnInit, OnChanges {

    @Input('question') question: Question;
    @Input('correctionState') correctionState: boolean;
    @Input('solutionShown') solutionShown: boolean;

    @Output() onSelectAnswer = new EventEmitter<string>();

    selectedAnswer;
    selectHeader: string;
    selectValue;

    constructor() {}

    ngOnInit() {
        this.solutionShown = false;
        this.correctionState = false;
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
        this.onSelectAnswer.emit(this.selectedAnswer);
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
