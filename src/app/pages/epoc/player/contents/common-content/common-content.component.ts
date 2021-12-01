import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'common-content',
    templateUrl: './common-content.component.html',
    styleUrls: ['./common-content.component.scss'],
})
export class CommonContentComponent implements OnInit {
    @Input() icon: string;
    @Input() title: string;
    @Input() subtitle: string;

    constructor() {
    }

    ngOnInit() {
    }

}
