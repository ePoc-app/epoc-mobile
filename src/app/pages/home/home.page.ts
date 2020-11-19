import {Component, OnInit} from '@angular/core';
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

    constructor(
        public libraryService: LibraryService
    ) {}

    ngOnInit() {
        this.epoc$ = this.libraryService.getEpoc(this.epocId);
    }

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}

