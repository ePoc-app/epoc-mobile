import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IonSelect, ToastController, Gesture, GestureController} from '@ionic/angular';
import {LibraryService} from '../../services/library.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {

    @ViewChild('video', {static: true}) videoRef: ElementRef;
    @ViewChild('tracks', {static: false}) trackSelectRef: IonSelect;
    @ViewChild('timelineProgress', {static: false}) timelineProgress: ElementRef;
    @ViewChild('timelineCursor', {static: false}) timelineCursorRef: ElementRef;

    @Input() src: string;
    @Input() poster: string;
    @Input() subtitles: string;
    @Input() controls;

    @Output() timelineDragging = new EventEmitter<string>();

    defaultControls = {
        show: true,
        timeline: true,
        playbutton: true,
        fullscreen: true,
        subtitles: true
    };

    video: HTMLVideoElement;
    hasPlayed = false;
    playing = false;
    trackSelected = 'none';

    progress = 0;

    constructor(
        public libraryService: LibraryService,
        public toastController: ToastController,
        private gestureCtrl: GestureController
    ) {}

    ngOnInit() {
        this.controls = Object.assign(this.defaultControls, this.controls);
        this.video = this.videoRef.nativeElement;
        this.video.addEventListener('play', (event) => {
            this.hasPlayed = true;
            this.playing = true;
        });
        this.video.addEventListener('pause', (event) => {
            this.playing = false;
        });
        this.video.addEventListener('timeupdate', (event) => {
            this.progress = this.video.currentTime / this.video.duration * 100;
        });
        this.video.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.video.setAttribute('controls', 'true');
            } else {
                this.video.removeAttribute('controls');
            }
        });
        this.video.textTracks.addEventListener('change', (event) => {
            this.trackSelected = 'none';

            for (const track of event.currentTarget as unknown as any[]) {
                if (track.mode === 'showing') {
                    this.trackSelected = track.language;
                }
            }
        });
    }

    ngAfterViewInit() {
        let startCursorPos;
        let timelinePos;
        const gesture: Gesture = this.gestureCtrl.create({
            el: this.timelineCursorRef.nativeElement,
            threshold: 0,
            gestureName: 'my-gesture',
            passive: false,
            gesturePriority: 10,
            onStart: () => {
                startCursorPos = this.timelineCursorRef.nativeElement.getBoundingClientRect();
                timelinePos = this.timelineCursorRef.nativeElement.parentNode.getBoundingClientRect();
                this.timelineDragging.emit('dragstart');
            },
            onEnd: () => {
                this.timelineDragging.emit('dragend');
            },
            onMove: (ev) => {
                const newX = Math.min(Math.max(startCursorPos.left - timelinePos.left + ev.deltaX, 0), timelinePos.width);
                const progress = newX / timelinePos.width;
                this.hasPlayed = true;
                this.timelineProgress.nativeElement.style.width = (progress * 100) + '%';
                this.timelineCursorRef.nativeElement.style.left = (progress * 100) + '%';
                this.video.currentTime = Math.round(progress * this.video.duration);
            }
        }, true);

        gesture.enable(true);
    }

    play() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    fullscreen() {
        if (typeof this.video.requestFullscreen === 'function') {
            this.video.requestFullscreen();
        } else if (typeof this.video.webkitEnterFullscreen === 'function') {
            this.video.webkitEnterFullscreen();
        } else {
            this.presentToast('Fullscreen not supported on your phone');
        }
    }

    seek(event) {
        event.preventDefault();
        event.stopPropagation();
        const timeline = event.target.closest('.video-timeline');
        const rect = timeline.getBoundingClientRect();
        const progress = (event.clientX - rect.left) / rect.width;
        this.video.currentTime = Math.round(progress * this.video.duration);
    }

    captions() {
        this.trackSelectRef.open();
    }

    changeSubtitles($event) {
        if ($event.detail.value === 'none') {
            for (const track of this.video.textTracks as unknown as any[]) {
                track.mode = 'disabled';
            }
        } else {
            for (const track of this.video.textTracks as unknown as any[]) {
                if (track.language === $event.detail.value) {
                    track.mode = 'showing';
                } else {
                    track.mode = 'disabled';
                }
            }
        }
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            position: 'top',
            message: text,
            duration: 2000
        });
        toast.present();
    }
}
