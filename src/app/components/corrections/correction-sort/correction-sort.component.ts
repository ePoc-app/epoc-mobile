import {Component, Input, OnInit} from '@angular/core';
import {DragAndDropquestion} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-sort',
  templateUrl: './correction-sort.component.html',
  styleUrls: ['../correction-common.scss', './correction-sort.component.scss'],
})
export class CorrectionSortComponent implements OnInit {
  @Input() question: DragAndDropquestion;
  @Input() userResponses: any[];

  correction: {correct: boolean, label: string, correctResponse: string}[][] = [];
  rightResponses = 0;
  wrongResponses = 0;
  sortGroups:string[];

  constructor() { }

  ngOnInit() {
    this.sortGroups = this.question.correctResponse.map((zone) => zone.label);
    this.correction = this.userResponses.map((group, groupIndex) => {
      return group.map(response => {
        const correct = this.question.correctResponse[groupIndex].values.indexOf(response.value) !== -1;
        correct ? this.rightResponses++ : this.wrongResponses++;
        return {
          correct,
          label: response.label,
          correctResponse: this.question.correctResponse.find(correctGroup => correctGroup.values.indexOf(response.value) !== -1).label
        }
      })
    });
    console.log(this.correction);
  }

}
