import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-multiple-choice',
  templateUrl: './correction-multiple-choice.component.html',
  styleUrls: ['../correction-common.scss', './correction-multiple-choice.component.scss'],
})
export class CorrectionMultipleChoiceComponent implements OnInit {
  @Input() question: Question;
  @Input() userResponses: any[];

  correction: {correct: boolean, label: string, feedback: string}[] = [];
  rightResponses = 0;
  wrongResponses = 0;
  missingResponses: {label: string, feedback: string}[] = [];

  constructor() { }

  ngOnInit() {
    this.question.responses.forEach((response, index) => {
      if ((this.question.correctResponse as Array<string>).indexOf(response.value) !== -1) {
        if (this.userResponses.indexOf(response.value) !== -1) {
          this.correction.push({correct:true, label: response.label, feedback: response.feedback});
          this.rightResponses++;
        } else{
          this.missingResponses.push({label: response.label, feedback: response.feedback})
        }
      } else {
        if (this.userResponses.indexOf(response.value) !== -1) {
          this.correction.push({correct:false, label: response.label, feedback: response.feedback});
          this.wrongResponses++;
        }
      }
    });
  }

}
