import {Component, Input, OnInit} from '@angular/core';
import {Question} from 'src/app/classes/contents/assessment';

@Component({
  selector: 'correction-generic',
  templateUrl: './correction-generic.component.html',
  styleUrls: ['./correction-generic.component.scss'],
})
export class CorrectionGenericComponent implements OnInit {
  @Input() question: Question;

  constructor() { }

  ngOnInit() {}

}
