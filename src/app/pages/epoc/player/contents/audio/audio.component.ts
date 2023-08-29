import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Content, Audio} from '@epoc/epoc-types/dist/v1/content';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {EpocService} from 'src/app/services/epoc.service';
import {ContentRuntime} from 'src/app/classes/contents/content';

@Component({
    selector: 'audio-content',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.scss'],
})
export class AudioContentComponent implements OnInit {

    @Input() inputContent: Content;
    @Output() timelineDragging = new EventEmitter<string>();

    content: (Audio & ContentRuntime);
    startTime:number;
    elapsed = 0;
    audioData: {duration:number};

    constructor(private readingService: ReadingStoreService, private epocService: EpocService) {}

    ngOnInit() {
        this.content = this.inputContent as (Audio & ContentRuntime);

    }

    forwardEvent(event) {
        this.timelineDragging.emit(event)
    }

    setAudioData(data) {
        this.audioData = data;
    }

    playPause(playing: boolean) {
        const epocId = this.epocService.epoc.id;

        if (playing) {
            this.readingService.saveStatement(epocId, this.content.id, 'played', true);
            this.startTime = performance.now();
        } else {
            this.elapsed += Math.round((performance.now() - this.startTime) / 1000);
            if (this.elapsed > Math.round(this.audioData.duration/2)) {
                this.readingService.saveStatement(epocId, this.content.id, 'listened', true);
            }
        }
    }
}
