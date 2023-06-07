import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Content, Audio} from '@epoc/epoc-types/dist/v1/content';

@Component({
    selector: 'audio-content',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.scss'],
})
export class AudioContentComponent implements OnInit {

    @Input() inputContent: Content;
    @Output() timelineDragging = new EventEmitter<string>();

    content: Audio;

    constructor() {}

    ngOnInit() {
        this.content = this.inputContent as Audio;

    }

    forwardEvent(event) {
        this.timelineDragging.emit(event)
    }
}
