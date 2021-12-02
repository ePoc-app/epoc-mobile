import {Component, Input, OnInit} from '@angular/core';
import {Assessment} from 'src/app/classes/contents/assessment';
import {Content} from 'src/app/classes/contents/content';
import {Reading, UserAssessment} from 'src/app/classes/reading';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {EpocService} from 'src/app/services/epoc.service';
import {uid} from 'src/app/classes/types';

@Component({
    selector: 'assessment-content',
    templateUrl: './assessment.component.html',
    styleUrls: ['./assessment.component.scss'],
})
export class AssessmentContentComponent implements OnInit {

    @Input() inputContent: Content;
    content: Assessment;
    reading: Reading;
    epocId: uid;
    userAssessment : UserAssessment;

    constructor(
        private readingStore: ReadingStoreService,
        private epocService: EpocService
    ) {}

    ngOnInit() {
        this.content = this.inputContent as Assessment;
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.epocId = this.epocService.epoc.id;
                this.reading = readings.find(question => question.epocId === this.epocId);
                this.userAssessment = this.reading.assessments.find(assessment => assessment.id === this.content.id);
            }
        });
    }
}
