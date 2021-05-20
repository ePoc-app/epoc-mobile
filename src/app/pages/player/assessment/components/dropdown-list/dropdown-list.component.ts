import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DropDownListQuestion, Response} from '../../../../../classes/contents/assessment';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent implements OnInit {
  @Input('question') question: DropDownListQuestion;
  @Input('disabled') disabled: boolean;
  @Input('correctionState') correctionState: boolean;

  @Output() onSelectAnswer = new EventEmitter<Array<Array<string>>>();

  correctedAnswers: Array<{category: string, answer: Response, correct: boolean}> = [];
  answers: Array<Array<string>> = [];
  nbCorrect: number;
  correctAnswers: Array<{answer: Response, correctAnswer: string}>;

  constructor(private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.nbCorrect = 0;
    this.answers = this.question.correctResponse.map((zone) => {
      return [];
    });
    this.correctAnswers = this.question.responses.map((response) => {
      return {answer: response, correctAnswer: this.getCorrectResponse(response.value)};
    })
  }

  onSelectProp({category, label}) {
    if (!this.question.responses.find(resp => resp.label === label)) {
      throw Error('La réponse n\'est pas valide');
    } else {
      this.answers[this.question.categories.indexOf(category)].push(this.question.responses.find(rep => rep.label === label).value);
        const correctedAnswer = {
          category,
          answer: this.question.responses.find(rep => rep.label === label),
          correct: this.question.correctResponse[this.question.categories.indexOf(category)]
              .values.includes(this.question.responses.find(rep => rep.label === label).value)
        };
        this.correctedAnswers.slice(this.question.categories.indexOf(category), 1);
        this.correctedAnswers[this.question.responses.findIndex(rep => rep.label === label)] = correctedAnswer;
        this.selectAnswers();
    }

  }

  selectAnswers() {
    let nbAnswer = 0;
    this.answers.forEach((answer) => {
      nbAnswer += answer.length;
    })
    if (nbAnswer !== this.question.responses.length) {
      return;
    }
    this.correctedAnswers.forEach((answer) => {
      if (answer.correct) {
        this.nbCorrect += 1;
      }
    })
    this.onSelectAnswer.emit(this.answers);
  }

  async openActionSheet(event) {
    const label = event.currentTarget.parentElement.firstChild.innerText;
      const actionSheet = await this.actionSheetController.create();
      actionSheet.mode ='ios';
      actionSheet.cssClass = 'dropdown-actionSheet'
      this.question.categories.forEach((category) => {
        actionSheet.buttons.push({
          text: category,
          handler: () => {
            this.onSelectProp({category, label});
          }
        })
      })
      await actionSheet.present();
  }

  getCorrectResponse(value: string) {
    return this.question.correctResponse.find(correctResponses => correctResponses.values.includes(value)).label;
  }
}
