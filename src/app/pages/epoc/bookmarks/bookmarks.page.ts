import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Reading} from 'src/app/classes/reading';
import {Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {LibraryService} from 'src/app/services/library.service';

@Component({
    selector: 'app-epoc-bookmarks',
    templateUrl: 'bookmarks.page.html',
    styleUrls: ['bookmarks.page.scss']
})
export class EpocBookmarksPage implements OnInit{

    epoc$: Observable<Epoc>;
    reading: Reading;
    epoc: Epoc;

    constructor(
        private route: ActivatedRoute,
        public libraryService: LibraryService,
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.route.snapshot.paramMap.get('id'));
            }
        });

        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc())
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
        });
    }

    deleteBookmark(i) {
        this.readingStore.removeBookmark(this.epoc.id, i);
    }
}
