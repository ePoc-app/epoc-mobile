import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({ template: '' })
export class AbstractActivityContainerComponent implements OnInit, OnChanges{
    @Input('question') question: Question;
    @Input('correctionState') correctionState: boolean;
    @Input('solutionShown') solutionShown: boolean;

    @Output() onSelectAnswer = new EventEmitter<any>();

    // Used in html to display values
    nbCorrect: number;
    selectHeader: string;

    constructor() {}

    ngOnInit() {
        this.nbCorrect = 0;
        this.solutionShown = false;
        this.correctionState = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.correctionState && changes.correctionState.currentValue) {
            this.updateDisplay(changes.correctionState.currentValue, this.solutionShown);
        }
        if (changes.solutionShown && (changes.solutionShown.currentValue || changes.solutionShown.currentValue === false)) {
            this.updateDisplay(this.correctionState, changes.solutionShown.currentValue);
        }
    }

    updateDisplay(correctionState: boolean, solutionShown: boolean) {
        if (!correctionState) {
            this.selectHeader = '';
        } else {
            if (!solutionShown) {
                this.selectHeader = this.nbCorrect + ' / ' + this.question.responses.length + ' réponses justes';
            } else {
                this.selectHeader = 'Solution';
            }
        }
    }
}
