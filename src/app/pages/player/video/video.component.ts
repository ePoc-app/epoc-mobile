import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import videojs from 'video.js';

@Component({
    selector: 'video-player',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {

    @ViewChild('target', {static: true}) target: ElementRef;

    @Input() src: string;

    options;
    player: videojs.Player;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.options = { fluid: true, autoplay: false, controls: true, sources: [{ src: this.src, type: 'video/mp4' }]};
        this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
        });
    }

    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    }
}
