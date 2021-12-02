import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Question, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Reading} from 'src/app/classes/reading';
import {Epoc} from 'src/app/classes/epoc';
import {FlipCardComponent} from 'src/app/components/flip-card/flip-card.component';

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

    @ViewChild(FlipCardComponent, { static: false })
    private flipCardComponent!: FlipCardComponent;

    correctionState = false;
    solutionShown = false;
    explanationShown = false;

    disabled = false;
    flipped = false;
    answer;
    reading: Reading;
    everythingIsCorrect = false;

    constructor(
        private readingStore: ReadingStoreService
    ) {
    }

    ngOnInit(): void {
        this.disabled = false;
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);

                const assessment = this.reading.assessments.find(a => a.id === this.content.id);

                if (assessment) {
                    this.disabled = true;
                    this.answer = assessment.responses;
                    this.showCorrection();
                    this.correctionState = true;
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
            this.flip();
        } else {
            this.disabled = true;
            this.showCorrection();
        }
    }

    flip() {
        if (this.disabled) {
            this.flipCardComponent.flip();
        }
    }

    showCorrection() {
        if (this.question.type === 'choice') {
            this.everythingIsCorrect = (this.question.correctResponse[0] === this.answer);
        } else if (this.question.type === 'multiple-choice') {
            this.everythingIsCorrect = true;
            if (this.answer.length !== this.question.correctResponse.length) {
                this.everythingIsCorrect = false;
            } else {
                this.answer.forEach((response) => {
                    if (!this.question.correctResponse.includes(response)) {
                        this.everythingIsCorrect = false;
                    }
                })
            }
        }
        this.correctionState = true;
        this.explanationShown = true;
        const score = this.everythingIsCorrect ? +this.question.score : 0;
        this.readingStore.saveResponses(this.epocId, this.content.id, score, this.answer);
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
        if (answer.detail.checked && index === -1 && !this.correctionState) {
            this.answer.push(answer.detail.value);
        } else {
            if (index >= 0) {
                this.answer.splice(index, 1);
            }
        }
    }
}
