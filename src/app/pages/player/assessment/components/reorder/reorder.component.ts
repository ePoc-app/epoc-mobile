import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'reorder',
    templateUrl: '../reorder/reorder.component.html',
    styleUrls: ['../reorder/reorder.component.scss'],
})
export class ReorderComponent implements OnInit, OnChanges {

    @Input('question') question: Question;
    @Input('correctionState') correctionState: boolean;
    @Input('solutionShown') solutionShown: boolean;

    @Output() onSelectAnswer = new EventEmitter<any>();

    // Array to loop on
    responses;
    correction = [];

    // Used in html to display values
    nbCorrect: number;
    selectHeader: string;
    selectClass = [];

    constructor() {}

    ngOnInit(): void {
        this.nbCorrect = 0;
        this.correctionState = false;
        this.solutionShown = false;
        this.responses = this.shuffleArray(this.question.responses);
        this.selectClass = this.question.responses.map((zone) => {
            return '';
        });
        for (let i = 0; i < this.question.correctResponse.length; i++) {
            this.correction[i] =
                this.question.responses[this.question.responses.findIndex(rep => rep.value === this.question.correctResponse[i])];
        }
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
        if (!correctionState) {
            this.selectHeader = '';
            this.selectClass = [];
        } else {
            if (!solutionShown) {
                this.selectHeader = this.nbCorrect + ' / ' + this.question.responses.length + ' réponses justes';
                const answer = this.responses.reduce( (accumulator, response) => accumulator + response.value, '');
                this.question.responses.forEach((rep) => {
                    this.selectClass[this.responses.indexOf(rep)] =
                        this.question.correctResponse[this.question.responses.indexOf(rep)]
                        === answer[this.question.responses.indexOf(rep)] ? 'correct' : 'incorrect';
                })
            } else {
                this.selectHeader = 'Solution';
                this.responses.forEach((rep) => {
                    this.selectClass[this.question.responses.indexOf(rep)] = 'correct';
                })
            }
        }
    }

    doReorder(ev: any) {
        this.responses = ev.detail.complete(this.responses);
        const answer = this.responses.reduce( (accumulator, response) => accumulator + response.value, '');
        this.nbCorrect = 0;
        for (let i = 0; i < this.question.correctResponse.length; i++) {
            if (answer[i] === this.question.correctResponse[i]) {
                this.nbCorrect++;
            }
        }
        this.onSelectAnswer.emit(answer);
    }

    shuffleArray(array) {
        const newArray = [...array]
        do {
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
        } while (this.arrayEquals(array, newArray));
        return newArray;
    }

    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
}
