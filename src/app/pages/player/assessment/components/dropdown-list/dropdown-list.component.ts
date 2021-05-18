import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DropdownListQuestion} from '../../../../../classes/contents/assessment';

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent implements OnInit {
  @Input('question') question: DropdownListQuestion;
  @Input('disabled') disabled: boolean;
  @Input('correctionState') correctionState: boolean;

  @Output() onSelectAnswer = new EventEmitter<Array<Array<string>>>();

  answers: Array<Array<string>>
  constructor() { }

  ngOnInit() {
    this.question.responses.forEach((response) => {
      this.answers[this.question.responses.indexOf(response)] = [];
    })
  }

  onSelectProp({prop, response}) {
    this.answers[this.question.responses.indexOf(response)].push(prop);
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
