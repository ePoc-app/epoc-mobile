import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DropdownListQuestion, Response} from '../../../../../classes/contents/assessment';
import {ActionSheetController} from '@ionic/angular';

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
  constructor(private actionSheetController: ActionSheetController) { }

  ngOnInit() {
  }

  onSelectProp({prop, response}) {
    if (!this.question.responses.includes(response)) {
      throw Error('La réponse n\'est pas valide');
    } else {
      this.answers[this.question.propositions.indexOf(prop)] = [response.value];
        const correctedAnswer = {
          proposition: prop,
          answer: response,
          correct: true
          // correct: this.question.correctResponse[this.question.propositions.indexOf(prop)].values.includes(response.value)
        };
        this.correctedAnswers.slice(this.question.propositions.indexOf(prop), 1);
        this.correctedAnswers[this.question.propositions.indexOf(prop)] = correctedAnswer;
        if (this.answers.length !== this.question.propositions.length || this.answers.includes(undefined)) {
          return;
        }
      this.selectAnswers();
    }

  }

  selectAnswers() {
    this.onSelectAnswer.emit(this.answers);
  }

  async openActionSheet(event) {
    const prop = event.currentTarget.parentElement.firstChild.innerText;
      const actionSheet = await this.actionSheetController.create();
      actionSheet.header = '?';
      this.question.responses.forEach((response) => {
        actionSheet.buttons.push({
          text: response.label,
          handler: () => {
            this.onSelectProp({prop, response});
          }
        })
      })
      await actionSheet.present();
  }

}
