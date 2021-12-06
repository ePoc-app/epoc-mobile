import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
    selector: 'reorder',
    templateUrl: '../reorder/reorder.component.html',
    styleUrls: ['../reorder/reorder.component.scss'],
})
export class ReorderComponent extends AbstractQuestionComponent implements OnInit {

    @Input() question: Question;

    // Array to loop on
    responses;
    correction = [];

    // Used in html to display values
    selectClass = [];

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.responses = this.shuffleArray(this.question.responses);
        this.selectClass = this.question.responses.map((zone) => {
            return '';
        });
        for (let i = 0; i < this.question.correctResponse.length; i++) {
            this.correction[i] =
                this.question.responses[this.question.responses.findIndex(rep => rep.value === this.question.correctResponse[i])];
        }
    }

    doReorder(ev: any) {
        this.responses = ev.detail.complete(this.responses);
        const answer = this.responses.reduce( (accumulator, response) => accumulator + response.value, '');
        this.userResponse.emit(answer);
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
