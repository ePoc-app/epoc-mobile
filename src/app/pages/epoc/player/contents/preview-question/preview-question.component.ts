import {Component, Input} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';
import {Content} from 'src/app/classes/contents/content';

@Component({
    selector: 'preview-question',
    templateUrl: './preview-question.component.html',
    styleUrls: ['./preview-question.component.scss'],
})
export class PreviewQuestionComponent{
    @Input() content: Content;
    @Input() question: Question;
    @Input() questionIndex: number;
}
