import {Component, Input, OnInit} from '@angular/core';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Reading} from 'src/app/classes/reading';

@Component({
    selector: 'assessment-button',
    templateUrl: './assessment-button.component.html',
    styleUrls: ['./assessment-button.component.scss'],
})
export class AssessmentButtonComponent implements OnInit {

    @Input() epoc;
    @Input() content;

    reading: Reading;

    constructor(
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(question => question.epocId === this.epoc.id);
            }
        });
    }

    getScore(content) {
        if (this.reading) {
            const userAssessment = this.reading.assessments.find(assessment => assessment.id === content.id);
            if (userAssessment) {
                return userAssessment.score;
            }
        }

        return null;
    }
}
