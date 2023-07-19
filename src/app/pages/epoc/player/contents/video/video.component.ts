import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Video} from 'src/app/classes/contents/video';
import {Content, ContentRuntime} from 'src/app/classes/contents/content';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {EpocService} from 'src/app/services/epoc.service';

@Component({
    selector: 'video-content',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoContentComponent implements OnInit {

    @Input() inputContent: Content;
    @Output() timelineDragging = new EventEmitter<string>();

    content: (Video & ContentRuntime);

    constructor(private readingService: ReadingStoreService, private epocService: EpocService) {}

    ngOnInit() {
        this.content = this.inputContent as (Video & ContentRuntime);
    }

    forwardEvent(event) {
        this.timelineDragging.emit(event)
    }

    play() {
        const epocId = this.epocService.epoc.id
        this.readingService.saveStatement(epocId, this.content.id, 'watched', true);
    }
}
