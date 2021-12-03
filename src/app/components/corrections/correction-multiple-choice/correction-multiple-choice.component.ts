import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-multiple-choice',
  templateUrl: './correction-multiple-choice.component.html',
  styleUrls: ['./correction-multiple-choice.component.scss'],
})
export class CorrectionMultipleChoiceComponent implements OnInit {
  @Input() question: Question;

  constructor() { }

  ngOnInit() {}

}
