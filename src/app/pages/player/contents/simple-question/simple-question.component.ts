import {Component, Input, OnInit} from '@angular/core';
import {Question, SimpleQuestion} from '../../../../classes/contents/assessment';
import {ReadingStoreService} from '../../../../services/reading-store.service';
import {Reading} from '../../../../classes/reading';
import {Epoc} from '../../../../classes/epoc';

@Component({
    selector: 'simple-question',
    templateUrl: './simple-question.component.html',
    styleUrls: ['./simple-question.component.scss'],
})
export class SimpleQuestionComponent implements OnInit {

    // besoin de la classe paramètre
    @Input() epoc: Epoc;
    @Input() content: SimpleQuestion;
    @Input() question: Question;
    @Input() epocId: string;

    correctionState = false;
    solutionShown = false;
    explanationShown = false;

    disabled = false;
    flipped = false;
    answer;
    questionSuccessed = false;
    reading: Reading;
    selectClass = [];
    everythingIsCorrect = false;

    constructor(
        private readingStore: ReadingStoreService
    ) {
    }

    ngOnInit(): void {
        this.disabled = false;
        this.selectClass = [];

        this.question.responses.forEach(() => {
            this.selectClass.push('');
        })
        // TO DO : Faire en sorte de lire les données de l'utilisateur pour lui affiché ce qu'il avait répondu en incorporant la correction
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);

                const assessment = this.reading.assessments.find(assessment => assessment.id === this.content.id);

                if (assessment) {
                    this.disabled = true;
                    this.answer = assessment.responses;
                } else {
                    this.disabled = false;
                    this.answer = this.question.type === 'choice' ? null : [];
                }
            }
        });
    }

    checkAnswer(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.question.responses.length === 0) {
            this.disabled = true;
            this.flip(e);
        } else {
            if (!this.disabled) {
                this.disabled = true;
                if (typeof this.question.correctResponse === 'string') {
                    if (this.question.correctResponse === this.answer) {
                        this.questionSuccessed = true;
                    } else {
                        this.questionSuccessed = false;
                    }
                } else if (Array.isArray(this.question.correctResponse)) {
                    if (this.question.correctResponse.length === this.answer.length &&
                        this.question.correctResponse.every((answer, index) => {
                            return this.answer ? this.answer.indexOf(answer) >= 0 : false;
                        })) {
                        this.questionSuccessed = true;
                    } else {
                        this.questionSuccessed = false;
                    }
                } else {
                    this.questionSuccessed = false;
                }

                this.readingStore.saveResponses(this.epocId, this.content.id, 0, this.answer);
                this.everythingIsCorrect = false;
            }
        }
        if (this.answer) {
            this.correctionState = true;
        }
        this.explanationShown = true;
    }

    flip(event) {
        event.stopPropagation();
        if (this.disabled) {
            this.flipped = !this.flipped;
        }
    }

    toggleSolution(event) {
        event.stopPropagation();
        this.solutionShown = !this.solutionShown;
    }

    selectAnswer(answer) {
        this.answer = answer;
    }

    selectAnswerMultiple(answer) {
        const index = this.answer.indexOf(answer.detail.value);
        const indexClass = this.question.responses.findIndex(response => response.value === answer.detail.value);
        if (answer.detail.checked && index === -1 && !this.correctionState) {
            this.answer.push(answer.detail.value);
            this.selectClass[indexClass] = this.answer.includes(answer.detail.value) ?
                (this.question.correctResponse.includes(answer.detail.value) ? 'correct' : 'incorrect') : '';
        } else {
            if (index >= 0) {
                this.answer.splice(index, 1);
                this.selectClass[indexClass] = '';
            }
        }
    }
}
