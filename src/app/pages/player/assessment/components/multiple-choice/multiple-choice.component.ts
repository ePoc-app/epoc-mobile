import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'multiple-choice',
    templateUrl: '../multiple-choice/multiple-choice.component.html',
    styleUrls: ['../multiple-choice/multiple-choice.component.scss'],
})
export class MultipleChoiceComponent implements OnInit, OnChanges {

    @Input('question') question: Question;
    @Input('correctionState') correctionState: boolean;
    @Input('solutionShown') solutionShown: boolean;

    @Output() onSelectAnswer = new EventEmitter<any>();

    // Array to loop on
    selectedAnswers = [];

    // Used in html to display values
    selectValue = [];
    selectClass = [];
    selectHeader: string;

    constructor() {}

    ngOnInit() {
        this.solutionShown = false;
        this.correctionState = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.correctionState && changes.correctionState.currentValue) {
            this.updateDisplay(changes.correctionState.currentValue, this.solutionShown);
        }
        if (changes.solutionShown && changes.solutionShown.currentValue) {
            this.updateDisplay(this.correctionState, changes.solutionShown.currentValue);
        } else if (changes.solutionShown && changes.solutionShown.currentValue === false) {
            this.updateDisplay(this.correctionState, changes.solutionShown.currentValue);
        }
    }

    updateDisplay(correctionState: boolean, solutionShown: boolean) {
        this.question.responses.forEach((response) => {
            if (!correctionState) {
                return;
            } else {
                if (!solutionShown) {
                    this.selectHeader = '';
                    this.selectClass[this.question.responses.indexOf(response)] = this.selectedAnswers.includes(response.value) ?
                        (this.question.correctResponse.includes(response.value) ? 'correct' : 'incorrect') : '';
                    this.selectValue[this.question.responses.indexOf(response)] = this.selectedAnswers.includes(response.value);
                } else {
                    this.selectClass[this.question.responses.indexOf(response)] =
                        this.question.correctResponse.includes(response.value) ? 'correct' : '';
                    this.selectHeader = 'Solution';
                    this.selectValue[this.question.responses.indexOf(response)] = this.question.correctResponse.includes(response.value);
                }
            }
        })
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
            this.onSelectAnswer.emit(this.selectedAnswers);
        }
        this.updateDisplay(this.correctionState, this.solutionShown);
    }
}
