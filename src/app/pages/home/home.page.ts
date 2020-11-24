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

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}

