import {Component, Input, OnInit} from '@angular/core';
import {Question, SimpleQuestion} from '../../../classes/contents/assessment';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {Reading} from '../../../classes/reading';

@Component({
    selector: 'simple-question',
    templateUrl: './simple-question.component.html',
    styleUrls: ['./simple-question.component.scss'],
})
export class SimpleQuestionComponent implements OnInit {

    @Input() content: SimpleQuestion;
    @Input() epocId: string;

    question: Question;
    disabled = false;
    flipped = false;
    answer;
    questionSuccessed = false;
    reading: Reading;

    constructor(
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit(): void {
        this.question = this.content.question;

        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);

                const assessment = this.reading.assessments.find(assessment => assessment.id === this.content.id);

                if (assessment) {
                    this.disabled = true;
                    this.answer = assessment.responses;
                } else {
                    this.disabled = false;
                    this.answer = null;
                }
            }
        });
    }

    checkAnswer(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.disabled) {
            this.disabled = true;
            if (typeof this.answer === 'string') {
                if (this.question.correctResponse === this.answer) {
                    this.questionSuccessed = true;
                } else {
                    this.questionSuccessed = false;
                }
            } else if (Array.isArray(this.question.correctResponse)) {
                if (this.question.correctResponse.every((answer, index) => {
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
        }
        this.flip();
    }

    flip() {
        if (this.disabled) {
            this.flipped = !this.flipped;
        }
    }

    selectAnswer(answer) {
        this.answer = answer;
    }

    selectAnswerMultiple(answer) {
        const index = this.answer.indexOf(answer.detail.value);
        if (answer.detail.checked && index === -1) {
            this.answer.push(answer.detail.value);
        } else {
            if (index >= 0) {
                this.answer.splice(index, 1);
            }
        }
    }
}
