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

    currentDelta = 0;

    constructor() {
    }

    ngOnInit() {
        setTimeout(() => {
            this.currentDelta = this.delta;
        }, 200);
    }

}
