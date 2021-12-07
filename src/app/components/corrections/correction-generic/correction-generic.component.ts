import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-generic',
  templateUrl: './correction-generic.component.html',
  styleUrls: ['../correction-common.scss', './correction-generic.component.scss'],
})
export class CorrectionGenericComponent implements OnInit {
  @Input() question: Question;
  @Input() userResponses: any[];

  correction: {correct: boolean, userResponseLabel: string, correctResponse: string}[] = [];

  constructor() { }

  ngOnInit() {
    this.userResponses.forEach((userResponse, index) => {
      this.correction.push({
        correct: this.question.correctResponse.indexOf(userResponse) !== -1,
        userResponseLabel: this.question.responses.find(response => response.value === userResponse).label,
        correctResponse: this.question.responses.find(response => response.value === this.question.correctResponse[index]).label
      })
    })
  }

}
