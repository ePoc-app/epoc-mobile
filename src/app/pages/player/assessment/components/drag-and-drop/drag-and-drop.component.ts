import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DragAndDropquestion} from '../../../../../classes/contents/assessment';

@Component({
    selector: 'drag-and-drop',
    templateUrl: '../drag-and-drop/drag-and-drop.component.html',
    styleUrls: ['../drag-and-drop/drag-and-drop.component.scss'],
})
export class DragAndDropComponent implements OnInit {

    @Input('question') question: DragAndDropquestion;
    @Input('questionMeta') questionMeta: {index: number, total: number};
    @Output() onSelectAnswer = new EventEmitter<any>();

    responses;

    selectedResponse;
    currentResponseIndex = 0;

    constructor() {}

    ngOnInit(): void {
        const shuffleArray = arr => arr
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);

        this.question.responses = shuffleArray(this.question.responses);

        this.selectedResponse = this.question.responses[0];
        this.responses = this.question.correctResponse.map((zone) => {
            return [];
        });
    }

    currentResponse() {
        return this.question.responses[this.currentResponseIndex];
    }

    selectZone(index){
        if (this.currentResponseIndex < this.question.responses.length) {
            this.responses[index].push(this.selectedResponse);
            this.currentResponseIndex++;
            this.selectedResponse = this.currentResponse();
            if (this.currentResponseIndex === this.question.responses.length) {
                this.updateAnswer();
            }
        }
    }

    selectResponse(response){
        this.selectedResponse = response;
    }

    updateAnswer() {
        const answer = [];
        this.responses.forEach((zone) => {
            answer.push(zone.map(response => response.value));
        });

        this.onSelectAnswer.emit(answer);
    }
}
