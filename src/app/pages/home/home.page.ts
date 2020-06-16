import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Epoc} from '../../classes/epoc';
import {LibraryService} from '../../services/library.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    epoc$: Observable<Epoc>;
    epocId = 'VP';
    hasPlayed = false;

    constructor(
        private elRef: ElementRef,
        private libraryService: LibraryService
    ) {}

    ngOnInit() {
        this.epoc$ = this.libraryService.getEpoc(this.epocId);
    }

    togglePlay($event) {
        if ($event.target.nodeName !== 'VIDEO' && $event.target.className.indexOf('controls-bar') === -1) {
            const video = $event.target.parentNode.querySelector('video');
            if (video.paused) {
                video.play();
                this.hasPlayed = true;
            } else {
                video.pause();
            }
        }
    }

    play($event) {
        $event.target.parentNode.classList.add('playing');
    }

    pause($event) {
        $event.target.parentNode.classList.remove('playing');
    }
}

