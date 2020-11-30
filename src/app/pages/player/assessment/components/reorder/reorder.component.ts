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
        this.responses = this.question.responses;
    }

    doReorder(ev: any) {
        this.responses = ev.detail.complete(this.responses);
        const answer = this.responses.reduce( (accumulator, response) => accumulator + response.value, '');
        this.onSelectAnswer.emit(answer);
    }
}
