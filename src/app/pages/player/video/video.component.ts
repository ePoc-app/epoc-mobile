import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import videojs from 'video.js';
import {ModalController} from '@ionic/angular';
import {TranscriptModalPage} from './transcript-modal/transcript-modal.page';

@Component({
    selector: 'video-player',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {

    @ViewChild('target', {static: true}) target: ElementRef;

    @Input() src: string;
    @Input() subtitles: string;

    options;
    player: videojs.Player;

    constructor(private elementRef: ElementRef, private modalController: ModalController) {}

    ngOnInit() {
        this.options = {
            fluid: true,
            autoplay: false,
            controls: true,
            sources: [{ src: this.src, type: 'video/mp4' }],
            textTrackSettings: false,
            controlBar: {
                pictureInPictureToggle: false
            }
        };
        this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
        });
    }

    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    }

    async showTranscript() {
        const modal = await this.modalController.create({
            component: TranscriptModalPage,
            componentProps: {
                'file': this.subtitles
            }
        });
        return await modal.present();
    }
}
