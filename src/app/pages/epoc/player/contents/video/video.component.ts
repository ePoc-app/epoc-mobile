import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Video} from 'src/app/classes/contents/video';
import {Content} from 'src/app/classes/contents/content';

@Component({
    selector: 'video-content',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoContentComponent implements OnInit {

    @Input() inputContent: Content;
    @Output() timelineDragging = new EventEmitter<string>();

    content: Video;

    constructor() {}

    ngOnInit() {
        this.content = this.inputContent as Video;
    }

    forwardEvent(event) {
        this.timelineDragging.emit(event)
    }
}
