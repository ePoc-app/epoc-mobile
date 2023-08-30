import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IonSelect, ToastController, Gesture, GestureController} from '@ionic/angular';
import {EpocService} from '../../services/epoc.service';
import {Capacitor} from '@capacitor/core';
import {CapacitorVideoPlayer} from 'capacitor-video-player';
import {Platform} from '@ionic/angular';


@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {

    @ViewChild('video', {static: false}) videoRef: ElementRef;
    @ViewChild('tracks', {static: false}) trackSelectRef: IonSelect;
    @ViewChild('timelineProgress', {static: false}) timelineProgress: ElementRef;
    @ViewChild('timelineCursor', {static: false}) timelineCursorRef: ElementRef;

    @Input() src: string;
    @Input() poster: string;
    @Input() subtitles: {label: string, lang: string, src: string}[];
    @Input() title: string;
    @Input() controls: {
        show?: boolean,
        timeline?: boolean,
        subtitles?: boolean,
        playbutton?: boolean,
        fullscreen?: boolean,
        overlay?: boolean
    };

    @Output() videoData = new EventEmitter<{duration: number}>();
    @Output() timelineDragging = new EventEmitter<string>();
    @Output() playPause = new EventEmitter<boolean>();

    // Android workaround video playback issue : https://github.com/ionic-team/capacitor/issues/6021
    isAndroid = Capacitor.isNativePlatform && Capacitor.getPlatform() === 'android';
    id: string;
    videoPlayer;
    // ---

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
        private ref: ChangeDetectorRef,
        public epocService: EpocService,
        public toastController: ToastController,
        private gestureCtrl: GestureController,
        private platform: Platform
    ) {}

    ngOnInit() {
        this.id = `video-${Math.random().toString(16)}`
        // Android workaround video playback issue : https://github.com/ionic-team/capacitor/issues/6021
        this.videoPlayer = CapacitorVideoPlayer
        this.controls = Object.assign(this.defaultControls, this.controls);
        // ---
    }

    // Android workaround video playback issue : https://github.com/ionic-team/capacitor/issues/6021
    async playAndroid() {
        if (!this.src) return;
        this.playing = true;
        this.playPause.emit(true);
        const url = this.src.startsWith('http') || this.src.startsWith('capacitor') ? this.src : `application/files/epocs/${this.epocService.epoc.id}/${this.src}`;
        const subindex = this.subtitles ? this.subtitles.findIndex(s => s.lang.indexOf('fr') !== -1) : -1;
        const subtitle = subindex >= 0 ? this.subtitles[subindex].src : '';
        const language = subindex >= 0 ? this.subtitles[subindex].lang : '';
        this.videoPlayer.initPlayer({
            mode: 'fullscreen',
            url,
            subtitle,
            language,
            playerId: this.id,
            componentTag: 'div',
            pipEnabled: false,
            bkmodeEnabled: false,
            chromecast: false
        }).then(async () => {
            const backbutton = this.platform.backButton.subscribeWithPriority(9999, () => {
                // do nothing
            });
            await this.videoPlayer.play({
                playerId: this.id
            })
            await this.videoPlayer.addListener('jeepCapVideoPlayerEnded', (data: any) => {
                this.playing = false;
                this.ref.detectChanges();
                backbutton.unsubscribe();
            }, false);
            await this.videoPlayer.addListener('jeepCapVideoPlayerExit', (data: any) => {
                this.playing = false;
                this.ref.detectChanges();
                backbutton.unsubscribe();
                this.playPause.emit(false);
            }, false);
            this.videoPlayer.getDuration({
                playerId: this.id
            }).then((r) => {
                this.videoData.emit({duration: r.value})
            })
        })
    }
    // ---

    ngAfterViewInit() {
        if (!this.videoRef) return;
        this.video = this.videoRef.nativeElement;
        this.video.addEventListener('error', (event) => {
            this.presentToast('Error loading video');
        })
        this.video.addEventListener('loadedmetadata', (event) => {
            this.videoData.emit({duration: this.video.duration});
        });
        this.video.addEventListener('play', (event) => {
            this.hasPlayed = true;
            this.playing = true;
            this.playPause.emit(true);
        });
        this.video.addEventListener('pause', (event) => {
            this.playing = false;
            this.playPause.emit(false);
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
        if (!this.timelineCursorRef) return;
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
        if (!this.video) return;
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    jump(delta) {
        this.video.currentTime = this.video.currentTime + delta;
        this.video.play();
    }

    fullscreen(event) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof this.video.requestFullscreen === 'function') {
            this.video.requestFullscreen();
        // @ts-ignore
        } else if (typeof this.video.webkitEnterFullscreen === 'function') {
            // @ts-ignore
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
