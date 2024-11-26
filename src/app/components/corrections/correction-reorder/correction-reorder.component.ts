import {Component, Input, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {DragAndDropquestion, Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-reorder',
  templateUrl: './correction-reorder.component.html',
  styleUrls: ['../correction-common.scss', './correction-reorder.component.scss'],
})
export class CorrectionReorderComponent implements OnInit {
  @Input() question: DragAndDropquestion;
  @Input() userResponses: any[];

  correction: {correct: boolean, label: string, correctResponse: string, feedback: string}[] = [];
  rightResponses = 0;
  wrongResponses = 0;

  constructor(public translate:TranslateService) { }

  ngOnInit () {
    this.correction = this.userResponses.map((response, index) => {
      const rightIndex = this.question.responses.findIndex(r => r.value === response);
      const correct =  rightIndex === index;
      correct ? this.rightResponses++ : this.wrongResponses++;
      console.log(response)
      return {
        correct,
        label: response.label,
        correctResponse: this.translate.instant('QUESTION.CORRECTION.POSITION') + (rightIndex+1),
        feedback: this.question.responses[rightIndex].feedback
      }
    });
  }
}
