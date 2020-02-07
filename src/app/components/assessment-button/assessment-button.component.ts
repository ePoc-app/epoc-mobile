import {Component, Input, OnInit} from '@angular/core';
import {ReadingStoreService} from '../../services/reading-store.service';
import {Reading} from '../../classes/reading';

@Component({
    selector: 'assessment-button',
    templateUrl: './assessment-button.component.html',
    styleUrls: ['./assessment-button.component.scss'],
})
export class AssessmentButtonComponent implements OnInit {

    @Input('epoc') epoc;
    @Input('content') content;

    reading: Reading;

    constructor(
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            this.reading = readings.find(item => item.epocId === this.epoc.id);
        });
    }

    getScore(content) {
        if (this.reading) {
            const userAssessment = this.reading.assessments.find(assessment => assessment.id === content.id);
            if (userAssessment) {
                return content.items.reduce((score, item, index) => {
                    return item.correctResponse === userAssessment.responses.sort().join('') ? score + item.score : 0;
                }, 0);
            }
        }

        return null;
    }

    getScoreTotal(content) {
        return content.items.reduce((total, item) => item.score + total, 0);
    }

}
