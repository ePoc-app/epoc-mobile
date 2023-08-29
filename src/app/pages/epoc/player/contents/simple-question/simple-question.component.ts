import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Question, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {Reading} from 'src/app/classes/reading';
import {Content} from 'src/app/classes/contents/content';
import {CommonQuestionComponent} from 'src/app/components/questions/common-question/common-question.component';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {EpocService} from 'src/app/services/epoc.service';
import {MatomoTracker} from '@ngx-matomo/tracker';

@Component({
    selector: 'simple-question',
    templateUrl: './simple-question.component.html',
    styleUrls: ['./simple-question.component.scss'],
})
export class SimpleQuestionComponent implements OnInit {
    @Input() content: Content;
    @Input() question: Question;
    @Input() epocId: string;
    @Output() dragging = new EventEmitter<string>();

    @ViewChild(CommonQuestionComponent, { static: false })
    private questionComponent!: CommonQuestionComponent;

    reading: Reading;
    userAssessment;
    questionAnswered = false;
    disableCheck = true;
    userResponses = [];

    constructor(
        private readingStore: ReadingStoreService,
        private epocService: EpocService,
        private readonly tracker: MatomoTracker
    ) {}

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);
                this.userAssessment = this.reading.assessments.find(a => a.id === this.content.id);
            }
        });
    }

    checkAnswer(event) {
        event.preventDefault();
        event.stopPropagation();
        const score = this.epocService.calcScore(this.question.score, this.question.correctResponse, this.userResponses);
        this.readingStore.saveResponses(this.epocId, this.content.id, score, this.userResponses);
        this.questionComponent.showCorrection();
        this.tracker.trackEvent('Assessments', 'Answered simple question', `Answered ${this.epocId} ${this.content.id}`, score);
        this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'attempted', true);
        this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'scored', score);
        if (score > 0) {
            this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'passed', true);
        } else {
            this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'failed', true);
        }
    }

    onQuestionAnswered (event) {
        this.questionAnswered = event;
    }

    onDrag(value){
        this.dragging.emit(value);
    }

    onUserHasResponded (userResponses) {
        this.userResponses = userResponses;
        this.disableCheck = false;
    }
}
