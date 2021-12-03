import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-reorder',
  templateUrl: './correction-reorder.component.html',
  styleUrls: ['./correction-reorder.component.scss'],
})
export class CorrectionReorderComponent implements OnInit {
  @Input() question: Question;

  constructor() { }

  ngOnInit() {}

}
