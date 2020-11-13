import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Epoc} from '../../classes/epoc';
import {LibraryService} from '../../services/library.service';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    epoc$: Observable<Epoc>;
    hasPlayed = false;

    constructor(
        private route: ActivatedRoute,
        public libraryService: LibraryService
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );
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

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}

