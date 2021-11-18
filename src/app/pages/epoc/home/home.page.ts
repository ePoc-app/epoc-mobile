import {Component, NgZone, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mode} from 'src/environments/environment.mode';
import {EpocService} from '../../../services/epoc.service';

@Component({
    selector: 'app-epoc-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class EpocHomePage implements OnInit {
    epocId;
    epoc$: Observable<Epoc>;
    epoc: Epoc;
    mode;

    constructor(
        private ngZone: NgZone,
        private route: ActivatedRoute,
        public epocService: EpocService
    ) {
        this.mode = mode;
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        );
        this.epocId = this.route.snapshot.paramMap.get('id');
        this.epoc$.subscribe(epoc => {
            this.ngZone.run( () => {
                this.epoc = epoc;
                this.epocId = this.epoc.id
            });
        });
    }

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}

