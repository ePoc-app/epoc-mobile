import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import videojs from 'video.js';

@Component({
    selector: 'video-player',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {

    @ViewChild('target', {static: true}) target: ElementRef;

    @Input() options: {
        fluid: boolean,
        aspectRatio: string,
        autoplay: boolean,
        muted: false,
        textTrackSettings: false,
        sources: {
            src: string,
            type: string,
        }[],
    };

    player: videojs.Player;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
            console.log('onPlayerReady', this);
        });
    }

    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    }
}
