import { Component, OnInit } from '@angular/core';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
  selector: 'thoughts',
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss'],
})
export class ThoughtsComponent extends AbstractQuestionComponent {

  constructor() {
    super();
  }
}
