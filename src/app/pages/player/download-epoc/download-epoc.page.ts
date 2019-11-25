import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';

@Component({
    selector: 'app-download-epoc',
    templateUrl: 'download-epoc.page.html',
    styleUrls: ['download-epoc.page.scss']
})
export class DownloadEpocPage implements OnInit{

    epoc$: Observable<Epoc>;
    progress = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );

        this.doProgress();
    }

    doProgress() {
        setTimeout(() => {
            if (this.progress < 1) {
                this.progress = this.progress + this.random(10, 30) / 100;
                this.doProgress();
            } else {
                this.openEpoc();
            }
        }, this.random(500, 1500));
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    openEpoc() {
        this.epoc$.subscribe(epoc => {
            this.readingStore.addReading(epoc);
            this.router.navigateByUrl('/player/play/' + epoc.id);
        });
    }
}
