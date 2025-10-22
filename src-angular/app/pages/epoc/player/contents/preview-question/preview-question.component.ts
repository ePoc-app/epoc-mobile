import {Component, Input} from '@angular/core';
import {Assessment, Question} from 'src/app/classes/contents/assessment';

@Component({
    selector: 'preview-question',
    templateUrl: './preview-question.component.html',
    styleUrls: ['./preview-question.component.scss'],
})
export class PreviewQuestionComponent{
    @Input() content: Assessment;
    @Input() question: Question;
    @Input() questionIndex: number;
}
