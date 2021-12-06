import {Component, Input, OnInit} from '@angular/core';
import {DropDownListQuestion} from 'src/app/classes/contents/assessment';
import {ActionSheetController} from '@ionic/angular';
import {AbstractQuestionComponent} from '../abstract-question.component';

@Component({
    selector: 'dropdown-list',
    templateUrl: './dropdown-list.component.html',
    styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent extends AbstractQuestionComponent implements OnInit {
    @Input() question: DropDownListQuestion;

    // Sent to parent
    answers: Array<Array<string>> = [];

    constructor(private actionSheetController: ActionSheetController) {
        super();
    }

    ngOnInit() {}

    selectAnswers() {
        this.userResponse.emit(this.answers);
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
                    // todo
                }
            })
        })
        await actionSheet.present();
    }

    getCorrectResponse(value: string) {
        return this.question.correctResponse.find(correctResponses => correctResponses.values.includes(value)).label;
    }
}
