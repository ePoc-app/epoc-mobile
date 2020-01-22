import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {LibraryService} from '../../services/library.service';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Epoc} from '../../classes/epoc';
import {NgForm} from '@angular/forms';
import {ReadingStoreService} from '../../services/reading-store.service';
import {Reading} from '../../classes/reading';
import {Assessment} from '../../classes/contents/assessment';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage implements OnInit, AfterViewInit {

    epoc$: Observable<Epoc>;

    readings: Reading[];

    // Reader
    fontSize = 14;
    pagePerView = window.innerWidth > 640 ? 2 : 1;
    columnWidth = (100 / this.pagePerView - 2) + 'vw';
    contentStyles = {'font-size' : this.fontSize + 'px'};
    currentPage = 0;
    pageCount = 1;
    pageWrapperTransform = 'translateX(0)';

    // Quiz related
    displaySubmit = true;
    displayResume = false;
    displayTryagain = false;

    // Bookmarks
    isBookmarked = false;

    constructor(
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        public alertController: AlertController,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );

        this.currentPage = +this.route.snapshot.paramMap.get('page');
    }

    ngAfterViewInit() {
        this.initReader();
    }

    onResize() {
        this.initReader();
    }

    initReader() {
        setTimeout(() => {
            this.pageCount = this.getColumnCount(this.elRef.nativeElement.querySelector('.pages-wrapper'));
            this.goToPage(this.currentPage);
        }, 100);
    }

    getColumnCount(elem) {
        const lastChild = elem.querySelector('div:last-child');
        return Math.floor((lastChild.offsetLeft + lastChild.offsetWidth) / elem.clientWidth) * this.pagePerView;
    }

    changeFontSize(delta) {
        if (this.fontSize + delta > 8 && this.fontSize + delta < 24) {
            this.fontSize = this.fontSize + delta;
            this.contentStyles = {'font-size' : this.fontSize + 'px'};
            this.initReader();
        }
    }

    goToPage(pageNumber) {
        this.pageWrapperTransform = 'translateX(-' + pageNumber * (99 / this.pagePerView) + 'vw)';
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.goToPage(this.currentPage);
        }
    }

    nextPage() {
        if (this.currentPage < this.pageCount) {
            this.currentPage++;
            this.goToPage(this.currentPage);
        }
    }
}
