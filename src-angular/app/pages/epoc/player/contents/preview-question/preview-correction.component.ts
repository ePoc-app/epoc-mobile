import {Component, Input, OnInit} from '@angular/core';
import {Assessment, Question} from 'src/app/classes/contents/assessment';

@Component({
    selector: 'preview-correction',
    templateUrl: './preview-correction.component.html',
    styleUrls: ['./preview-correction.component.scss'],
})
export class PreviewCorrectionComponent implements OnInit{
    @Input() content: Assessment;
    @Input() question: Question;
    @Input() questionIndex: number;

    userResponses;

    constructor() {}

    ngOnInit(): void {
        if (typeof this.question.correctResponse === 'string') {
            this.userResponses = [this.question.correctResponse]
        } else if (this.question.correctResponse.length) {
            if (typeof this.question.correctResponse[0] === 'string') {
                this.userResponses = this.question.correctResponse
            } else {
                this.userResponses = (this.question.correctResponse as Array<{label: string, values: string[]}>).map(group => {
                    return group.values.map(value => {
                        return this.question.responses.find(response => response.value === value)
                    })
                })
            }
        }
    }
}
