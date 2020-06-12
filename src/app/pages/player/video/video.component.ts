import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Video} from '../../../classes/contents/video';
import {IonSelect} from '@ionic/angular';

@Component({
    selector: 'video-player',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {

    @ViewChild('video', {static: true}) videoRef: ElementRef;
    @ViewChild('tracks', {static: true}) trackSelectRef: IonSelect;

    @Input() content: Video;

    video: HTMLMediaElement;
    playing = false;
    trackSelected = 'none';

    constructor() {}

    ngOnInit() {
        this.video = this.videoRef.nativeElement;
        this.video.addEventListener('play', (event) => {
            this.playing = true;
        });
        this.video.addEventListener('pause', (event) => {
            this.playing = false;
        });
        this.video.textTracks.addEventListener('change', (event) => {
            this.trackSelected = 'none';

            for (const track of event.currentTarget) {
                if (track.mode === 'showing') {
                    this.trackSelected = track.language;
                }
            }
        });
    }

    play() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    fullscreen() {
        this.video.requestFullscreen();
    }

    captions() {
        this.trackSelectRef.open();
    }

    changeSubtitles($event) {
        if ($event.detail.value === 'none') {
            for (const track of this.video.textTracks) {
                track.mode = 'disabled';
            }
        } else {
            for (const track of this.video.textTracks) {
                if (track.language === $event.detail.value) {
                    track.mode = 'showing';
                } else {
                    track.mode = 'disabled';
                }
            }
        }
    }

    ngOnDestroy() {

    }
}
