import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'score-progress',
    templateUrl: './score-progress.component.html',
    styleUrls: ['./score-progress.component.scss'],
})
export class ScoreProgressComponent implements OnInit {

    @Input() progress: number;
    @Input() delta: number;
    @Input() threshold: number;
    @Input() minLabel: number;
    @Input() maxLabel: number;

    currentDelta = 0;
    thresholdPoints;

    constructor() {
    }

    ngOnInit() {
        this.thresholdPoints = Math.round(this.threshold/100*this.maxLabel);
        setTimeout(() => {
            this.currentDelta = this.delta;
        }, 200);
    }

}
