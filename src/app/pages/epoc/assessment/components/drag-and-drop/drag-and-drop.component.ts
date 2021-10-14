import {Component, Input, OnInit} from '@angular/core';
import {trigger, transition, animate, style} from '@angular/animations';
import {DragAndDropquestion} from 'src/app/classes/contents/assessment';
import {AbstractActivityContainerComponent} from '../../abstract-activity-container.component';

@Component({
    selector: 'drag-and-drop',
    templateUrl: '../drag-and-drop/drag-and-drop.component.html',
    styleUrls: ['../drag-and-drop/drag-and-drop.component.scss'],
    animations: [
        trigger('fadeOut', [
            transition(':leave', [
                style({position: 'absolute', width: '100%', top: 0, opacity: 1}),
                animate('200ms ease-in', style({opacity: 1}))
            ])
        ]),
        trigger('slideInOut', [
            transition(':enter', [
                style({opacity: 0, transform: 'translateY(100%)'}),
                animate('200ms 100ms ease-in', style({opacity: 1, transform: 'translateY(0%)'}))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({transform: 'translateY(100%)'}))
            ])
        ])
    ]
})
export class DragAndDropComponent extends AbstractActivityContainerComponent implements OnInit {

    @Input('question') question: DragAndDropquestion;

    current;
    responses;
    answer;

    // Used in html to display values
    selectValue = [];
    selectClass: any;

    constructor() {
        super();
    }

    ngOnInit(): void {
        const shuffleArray = arr => arr
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);

        this.responses = shuffleArray(this.question.responses);

        this.answer = this.question.correctResponse.map((zone) => {
            return [];
        });
        this.selectClass = this.question.correctResponse.map((zone) => {
            return [];
        });
    }

    updateDisplay(correctionState: boolean, solutionShown: boolean) {
        if (!correctionState) {
            this.selectHeader = '';
            this.selectValue = [];
        } else {
            if (!solutionShown) {
                this.selectHeader = this.nbCorrect + ' / ' + this.question.responses.length + ' réponses justes';
            } else {
                this.selectHeader = 'Solution';
                // Mettre les bonnes valeurs au bon endroit lors de l'affichage de la solution
                this.question.responses.forEach((response) => {
                    this.selectValue[response.value] = response.label;
                })
            }
            // Mettre les bonnes couleurs au bon endroit
            this.question.correctResponse.forEach((zone) => {
                this.answer[this.question.correctResponse.indexOf(zone)].forEach((response) => {
                    if (!solutionShown) {
                        this.selectClass
                            [this.question.correctResponse.indexOf(zone)]
                            [this.answer[this.question.correctResponse.indexOf(zone)].indexOf(response)]
                            = this.question.correctResponse[this.question.correctResponse.indexOf(zone)].values.includes(response.value)
                            ? 'correct' : 'incorrect';
                    } else {
                        this.selectClass
                            [this.question.correctResponse.indexOf(zone)]
                            [this.answer[this.question.correctResponse.indexOf(zone)].indexOf(response)]
                            = 'correct';
                    }
                })
            })
        }
    }

    // trick to trigger angular aniamtion
    getCurrentResponse() {
        return [this.responses[0]];
    }

    addResponse(index) {
        if (this.responses.length > 0) {
            this.answer[index].push(this.responses.shift());
            if (this.responses.length === 0) {
                this.updateAnswer();
            }
        }

        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(dropZone => {
            dropZone.scrollTop = dropZone.scrollHeight - dropZone.clientHeight;
        });
    }

    removeResponse($event, zoneIndex, responseIndex) {
        $event.stopPropagation();
        const response = this.answer[zoneIndex].splice(responseIndex, 1);
        this.responses.unshift(...response);
    }

    updateAnswer() {
        const answer = [];
        this.nbCorrect = 0;
        this.answer.forEach((zone) => {
            answer.push(zone.map(response => response.value));
            zone.forEach((rep) => {
                if (this.question.correctResponse[this.answer.indexOf(zone)].values.includes(rep.value)) {
                    this.nbCorrect++;
                }
            })
        });
        this.onSelectAnswer.emit(answer);
    }
}
