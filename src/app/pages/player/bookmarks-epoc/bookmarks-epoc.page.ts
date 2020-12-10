import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {Reading} from '../../../classes/reading';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {LibraryService} from '../../../services/library.service';

@Component({
    selector: 'app-bookmarks-epoc',
    templateUrl: 'bookmarks-epoc.page.html',
    styleUrls: ['bookmarks-epoc.page.scss']
})
export class BookmarksEpocPage implements OnInit{

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
