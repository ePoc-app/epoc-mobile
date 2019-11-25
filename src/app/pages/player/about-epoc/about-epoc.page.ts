import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';

@Component({
    selector: 'app-about-epoc',
    templateUrl: 'about-epoc.page.html',
    styleUrls: ['about-epoc.page.scss']
})
export class AboutEpocPage implements OnInit{

    epoc$: Observable<Epoc>;

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
    }

    isReading(id) {
        return this.readingStore.readings.findIndex(reading => reading.epocId === id) !== -1;
    }

    openEpoc(id) {
        this.router.navigateByUrl('/player/play/' + id);
    }

    downloadEpoc(id) {
        this.router.navigateByUrl('/player/download/' + id);
    }
}
