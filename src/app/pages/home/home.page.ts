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
    zrrId = 'C042AD';

    constructor(
        private elRef: ElementRef,
        private libraryService: LibraryService
    ) {}

    ngOnInit() {
        this.epoc$ = this.libraryService.getEpoc(this.zrrId);
    }

    togglePlay($event) {
        const video = $event.target.nodeName === 'VIDEO' ? $event.target : $event.target.querySelector('video');
        video.paused ? video.play() : video.pause();
    }

    play($event) {
        $event.target.parentNode.classList.add('playing');
    }

    pause($event) {
        $event.target.parentNode.classList.remove('playing');
    }
}

