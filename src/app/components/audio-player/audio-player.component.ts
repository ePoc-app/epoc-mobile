import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ToastController, Gesture, GestureController} from '@ionic/angular';
import {EpocService} from '../../services/epoc.service';


@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {

    @ViewChild('audio', {static: false}) audioRef: ElementRef;
    @ViewChild('canvas', {static: false}) canvasRef: ElementRef;
    @ViewChild('timelineProgress', {static: false}) timelineProgress: ElementRef;
    @ViewChild('timelineCursor', {static: false}) timelineCursorRef: ElementRef;
    @Input() controls: {
        show?: boolean,
        timeline?: boolean,
        playbutton?: boolean
    };
    @Input() src: string;
    @Input() title: string;

    @Output() audioData = new EventEmitter<{duration: number}>();
    @Output() timelineDragging = new EventEmitter<string>();
    @Output() playPause = new EventEmitter<boolean>();

    id: string;
    audioPlayer;

    defaultControls = {
        show: true,
        timeline: true,
        playbutton: true
    };

    audio: HTMLAudioElement;
    hasPlayed = false;
    playing = false;
    trackSelected = 'none';

    progress = 0;

    constructor(
        private ref: ChangeDetectorRef,
        public epocService: EpocService,
        public toastController: ToastController,
        private gestureCtrl: GestureController
    ) {}

    ngOnInit() {
        this.controls = Object.assign(this.defaultControls, this.controls);
    }

    ngAfterViewInit() {
        if (!this.audioRef || !this.canvasRef) return;
        this.audio = this.audioRef.nativeElement;
        this.audio.addEventListener('loadedmetadata', (event) => {
            this.audioData.emit({duration: this.audio.duration});
        });
        this.audio.addEventListener('play', () => {
            this.hasPlayed = true;
            this.playing = true;
            this.playPause.emit(true);
        });
        this.audio.addEventListener('pause', () => {
            this.playing = false;
            this.playPause.emit(false);
        });
        this.audio.addEventListener('timeupdate', () => {
            this.progress = this.audio.currentTime / this.audio.duration * 100;
        });
        const audio1 = this.audioRef.nativeElement;
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        const audioCtx = new AudioContext();
        let audioSource;
        let analyser;
        audioSource = audioCtx.createMediaElementSource(audio1);
        analyser = audioCtx.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = canvas.width / bufferLength;
        let x = 0;
        let barHeight;
        function animate() {
            x = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(dataArray);
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (canvas.height * dataArray[i]) / 255;
                ctx.fillStyle = 'rgba(55,63,91,1)';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 5;
            }

            requestAnimationFrame(animate);
        }

        animate();

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
                this.audio.currentTime = Math.round(progress * this.audio.duration);
            }
        }, true);

        gesture.enable(true);
    }

    play() {
        if (!this.audio) return;
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    jump(delta) {
        this.audio.currentTime = this.audio.currentTime + delta;
        this.audio.play();
    }

    seek(event) {
        event.preventDefault();
        event.stopPropagation();
        const timeline = event.target.closest('.audio-timeline');
        const rect = timeline.getBoundingClientRect();
        const progress = (event.clientX - rect.left) / rect.width;
        this.audio.currentTime = Math.round(progress * this.audio.duration);
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
