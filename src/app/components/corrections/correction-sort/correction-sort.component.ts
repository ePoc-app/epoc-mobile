import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-sort',
  templateUrl: './correction-sort.component.html',
  styleUrls: ['./correction-sort.component.scss'],
})
export class CorrectionSortComponent implements OnInit {
  @Input() question: Question;

  constructor() { }

  ngOnInit() {}

}
