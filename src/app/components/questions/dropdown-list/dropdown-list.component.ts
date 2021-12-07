import {Component, Input, OnInit} from '@angular/core';
import {DropDownListQuestion} from 'src/app/classes/contents/assessment';
import {ActionSheetController} from '@ionic/angular';
import {AbstractQuestionComponent} from '../abstract-question.component';
import {ActionSheetButton} from '@ionic/core/dist/types/components/action-sheet/action-sheet-interface';

@Component({
    selector: 'dropdown-list',
    templateUrl: './dropdown-list.component.html',
    styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent extends AbstractQuestionComponent implements OnInit {
    @Input() question: DropDownListQuestion;

    selectChoices: string[];
    userResponses: {label:string, value:string, category?: number}[];
    answers = [];

    constructor(private actionSheetController: ActionSheetController) {
        super();
    }

    ngOnInit() {
        this.selectChoices = this.question.correctResponse.map((zone) => {
            return zone.label;
        });

        this.userResponses = this.question.responses.map(response => {
            return {label: response.label, value: response.value};
        })
    }

    async openActionSheet(response) {
        if (this.disabled) return;
        const buttons = [...this.selectChoices.map((category, index) => {
            return {
                text: category,
                handler: () => {
                    this.selectCategory(index, response)
                }
            }
        }),
        {
            text: 'Fermer',
            role: 'cancel'
        }];
        const actionSheet = await this.actionSheetController.create({
            mode: 'ios',
            header: 'Sélectionnez une réponse',
            cssClass: 'custom-action-sheet',
            buttons
        });

        await actionSheet.present();
    }

    selectCategory (index, response) {
        response.category = index;
        if (this.userResponses.every(r => r.hasOwnProperty('category'))){
            this.setUserResponse();
        }
    }

    setUserResponse() {
        this.answers = this.selectChoices.map((group, index) => {
            return this.userResponses.filter(r => r.category === index)
        });
        this.userResponse.emit(this.answers);
    }
}
