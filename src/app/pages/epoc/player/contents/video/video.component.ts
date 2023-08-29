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
    startTime:number;
    elapsed = 0;
    videoData: {duration:number};

    constructor(private readingService: ReadingStoreService, private epocService: EpocService) {}

    ngOnInit() {
        this.content = this.inputContent as (Video & ContentRuntime);
    }

    setVideoData(data) {
        this.videoData = data;
    }

    forwardEvent(event) {
        this.timelineDragging.emit(event)
    }

    playPause(playing: boolean) {
        const epocId = this.epocService.epoc.id;

        if (playing) {
            this.readingService.saveStatement(epocId, 'contents', this.content.id, 'played', true);
            this.startTime = performance.now();
        } else {
            this.elapsed += Math.round((performance.now() - this.startTime) / 1000);
            if (this.elapsed > Math.round(this.videoData.duration/2)) {
                this.readingService.saveStatement(epocId, 'contents', this.content.id, 'watched', true);
            }
        }
    }
}
