import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'reorder',
    templateUrl: '../reorder/reorder.component.html',
    styleUrls: ['../reorder/reorder.component.scss'],
})
export class ReorderComponent implements OnInit {

    @Input('question') question: Question;
    @Input('disabled') disabled: boolean;
    @Output() onSelectAnswer = new EventEmitter<any>();

    responses;

    constructor() {}

    ngOnInit(): void {
        this.responses = this.shuffleArray(this.question.responses);
    }

    doReorder(ev: any) {
        this.responses = ev.detail.complete(this.responses);
        const answer = this.responses.reduce( (accumulator, response) => accumulator + response.value, '');
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
