import {Component, Input, OnInit} from '@angular/core';
import {DropDownListQuestion, Response} from 'src/app/classes/contents/assessment';
import {ActionSheetController} from '@ionic/angular';
import {AbstractActivityContainerComponent} from '../../abstract-activity-container.component';

@Component({
    selector: 'dropdown-list',
    templateUrl: './dropdown-list.component.html',
    styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent extends AbstractActivityContainerComponent implements OnInit {
    @Input('question') question: DropDownListQuestion;

    // Array to loop on when in correction mode
    correctedAnswers: Array<{ category: string, answer: Response, correct: boolean }> = [];

    // Array to loop on when in normal mode
    correctAnswers: Array<{ answer: Response, correctAnswer: string }>;

    // Used in html to display values
    selectValue = [];
    selectClass = [];

    // Sent to parent
    answers: Array<Array<string>> = [];

    constructor(private actionSheetController: ActionSheetController) {
        super();
    }

    ngOnInit() {
        this.answers = this.question.correctResponse.map((zone) => {
            return [];
        });
        this.correctAnswers = this.question.responses.map((response) => {
            return {answer: response, correctAnswer: this.getCorrectResponse(response.value)};
        })
        this.question.responses.forEach(() => {
            this.selectValue.push('Cliquez pour sélectionner');
        })
        this.question.categories = this.question.correctResponse.map(response => response.label);
    }

    updateDisplay(correctionState: boolean, solutionShown: boolean) {
        this.question.responses.forEach((response) => {
            if (this.correctedAnswers[this.question.responses.indexOf(response)]) {
                if (!correctionState) {
                    this.selectClass = [];
                    this.selectHeader = '';
                    if (!this.correctedAnswers[this.question.responses.indexOf(response)]) {
                        return;
                    } else {
                        this.selectValue[this.question.responses.indexOf(response)] =
                            this.correctedAnswers[this.question.responses.indexOf(response)].category;
                    }
                } else {
                    if (!solutionShown) {
                        this.selectValue[this.question.responses.indexOf(response)] =
                            this.correctedAnswers[this.question.responses.indexOf(response)].category;
                        this.selectClass[this.question.responses.indexOf(response)] =
                            this.correctedAnswers[this.question.responses.indexOf(response)].correct ? 'correct' : 'incorrect';
                        this.selectHeader = this.nbCorrect + ' / ' + this.question.responses.length + ' réponses justes';
                    } else {
                        this.selectValue[this.question.responses.indexOf(response)] =
                            this.correctAnswers[this.question.responses.indexOf(response)].correctAnswer;
                        this.selectClass[this.question.responses.indexOf(response)] = 'correct';
                        this.selectHeader = 'Solution';
                    }
                }
            }
        })
    }

    onSelectProp({category, label}) {
        if (!this.question.responses.find(resp => resp.label === label)) {
            throw Error('La réponse n\'est pas valide');
        } else {
            this.answers.forEach((categ) => {
                if (categ.includes(this.question.responses.find(rep => rep.label === label).value)) {
                    categ.splice(categ.indexOf(this.question.responses.find(rep => rep.label === label).value), 1);
                }
            })
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
            this.updateDisplay(this.correctionState, this.solutionShown);
        }

    }

    selectAnswers() {
        let nbAnswer = 0;
        this.answers.forEach((answer) => {
            nbAnswer += answer.length;
        })
        if (nbAnswer < this.question.responses.length) {
            return;
        }
        this.nbCorrect = 0;
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
        actionSheet.mode = 'ios';
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
