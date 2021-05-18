import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DropdownListQuestion, Response} from '../../../../../classes/contents/assessment';

@Component({
  selector: 'dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent implements OnInit {
  @Input('question') question: DropdownListQuestion;
  @Input('disabled') disabled: boolean;
  @Input('correctionState') correctionState: boolean;

  @Output() onSelectAnswer = new EventEmitter<Array<Array<string>>>();

  correctedAnswers: Array<{proposition: string, answer: Response, correct: boolean}> = [];
  answers: Array<Array<string>> = [];
  constructor() { }

  ngOnInit() {
    this.question.propositions.forEach((prop) => {
      this.answers[this.question.propositions.indexOf(prop)] = [];
    })
  }

  onSelectProp({prop, response}) {
    this.answers[this.question.propositions.indexOf(prop)].push(response.value);
    if (this.answers.length === this.question.propositions.length) {
      this.selectAnswers();
    }
  }

  selectAnswers() {
    this.onSelectAnswer.emit(this.answers);
  }

  openActionSheet() {

  }

}
