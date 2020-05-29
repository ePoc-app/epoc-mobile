import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from '../../classes/epoc';
import {Reading} from '../../classes/reading';
import {ReadingStoreService} from '../../services/reading-store.service';
import {LibraryService} from '../../services/library.service';
import {Content} from '../../classes/contents/content';
import {Settings} from '../../classes/settings';
import {SettingsStoreService} from '../../services/settings-store.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    contents: Content[] = [];
    reading: Reading;

    // Reader
    fontSize = 14;
    pagePerView = Math.ceil(window.innerWidth / 640);
    columnWidth = (100 / this.pagePerView - 2) + 'vw';
    contentStyles = {'font-size': this.fontSize + 'px'};
    currentPage = 0;
    pageCount = 1;
    pageWrapperTransform = 'translateX(0)';
    isScrolling = false;
    pageWrapperOffset;
    startX;
    startOffset;

    // Reading default settings
    settings: Settings = {
        font: 'sans',
        fontSize: 16,
        lineHeight: 1.4,
        darkMode: false
    };

    constructor(
        @Inject(DOCUMENT) document,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        public alertController: AlertController,
        public actionSheetController: ActionSheetController,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        private settingsStore: SettingsStoreService
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );

        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                const epocId = this.route.snapshot.paramMap.get('id');
                this.reading = readings.find(item => item.epocId === epocId);
            }
        });

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;

            epoc.parts.forEach((part) => {
                const contents = part.outline.map((id) => {
                    return epoc.content.find(item => item.id === id);
                });
                this.contents = this.contents.concat(contents);
            });
        });

        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.afterDataInit();
            }
        });

        this.settingsStore.settings$.subscribe(settings => {
            if (settings) {
                this.settings = settings;
            }
        });
    }

    afterDataInit() {
        this.readingStore.addReading(this.epoc.id);
        // Go to progress (percentage)
        const progress = this.route.snapshot.paramMap.has('progress') && !Number.isNaN(+this.route.snapshot.paramMap.get('progress')) ?
            +this.route.snapshot.paramMap.get('progress') : this.reading.progress;
        // Go to specific content
        const contentId = this.route.snapshot.paramMap.get('contentId');
        this.initReader(progress, contentId);
    }

    onResize() {
        this.initReader();
    }

    onMouseDown(e) {
        this.isScrolling = true;
        this.startX = e.changedTouches[0].pageX - this.pageWrapperOffset;
        this.startOffset = this.pageWrapperOffset;
    }

    onMouseUp(e) {
        this.isScrolling = false;
        const deltaX = this.startOffset - this.pageWrapperOffset;
        // Swipe left
        if (deltaX < -80 && deltaX > -400) {
            this.prevPage();
            // Swipe right
        } else if (this.startOffset - this.pageWrapperOffset > 80 && this.startOffset - this.pageWrapperOffset < 400) {
            this.nextPage();
        }
        this.goToNearestPage();
    }

    onMouseMove(e) {
        if (e.changedTouches && e.changedTouches.length) {
            this.pageWrapperOffset = e.changedTouches[0].pageX - this.startX;
            this.pageWrapperTransform = 'translateX(' + this.pageWrapperOffset + 'px)';
        }
    }

    initReader(progress?: number, contentId?: string) {
        this.pagePerView = Math.ceil(window.innerWidth / 768);
        this.columnWidth = (100 / this.pagePerView - 2) + 'vw';
        setTimeout(() => {
            this.pageCount = this.getPageCount();
            if (contentId) {
                console.log(contentId);
                const contentElem = document.getElementById('content-' + contentId);
                this.pageWrapperOffset = contentElem ? -contentElem.offsetLeft : 0;
                this.pageWrapperTransform = 'translateX(' + this.pageWrapperOffset + 'px)';
                this.goToNearestPage();
            } else if (progress) {
                this.changeCurrentPage(Math.floor(progress / 100 * this.pageCount));
                this.goToPage(this.currentPage);
            } else {
                this.goToNearestPage();
            }
        }, 200);
    }

    getPageCount() {
        const elem = this.elRef.nativeElement.querySelector('.pages-wrapper');
        return Math.ceil(elem.scrollWidth / elem.clientWidth) * this.pagePerView - this.pagePerView - 1;
    }

    changeFontSize(delta) {
        if (this.fontSize + delta > 8 && this.fontSize + delta < 24) {
            this.fontSize = this.fontSize + delta;
            this.contentStyles = {'font-size': this.fontSize + 'px'};
            this.initReader();
        }
    }

    changeCurrentPage(page) {
        if (this.currentPage !== page){
            this.currentPage = page;
            this.stopAllMedia();
        }
    }

    goToNearestPage() {
        let nearestPage = 0;
        let smallestGap = 9999999;
        for (let i = 0; i < this.pageCount + 1; i++) {
            const gap = Math.abs(-i * window.innerWidth / this.pagePerView - this.pageWrapperOffset);
            if (gap < smallestGap) {
                smallestGap = gap;
                nearestPage = i;
            }
        }
        this.changeCurrentPage(nearestPage);
        this.goToPage(nearestPage);
    }

    goToPage(pageNumber) {
        this.pageWrapperOffset = -pageNumber * ((window.innerWidth / this.pagePerView) + 1);
        this.pageWrapperTransform = 'translateX(' + this.pageWrapperOffset + 'px)';
        this.readingStore.updateProgress(this.epoc.id, Math.ceil(this.getProgress() * 100));
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.changeCurrentPage(this.currentPage - 1);
            this.goToPage(this.currentPage);
        } else {
            this.pageWrapperOffset = this.pageWrapperOffset + 100;
            this.pageWrapperTransform = 'translateX(' + this.pageWrapperOffset + 'px)';
            setTimeout(() => this.goToNearestPage(), 300);
        }
    }

    nextPage() {
        if (this.currentPage < this.pageCount) {
            this.changeCurrentPage(this.currentPage + 1);
            this.goToPage(this.currentPage);
        } else {
            this.pageWrapperOffset = this.pageWrapperOffset - 100;
            this.pageWrapperTransform = 'translateX(' + this.pageWrapperOffset + 'px)';
            setTimeout(() => this.goToNearestPage(), 300);
        }
    }

    getProgress() {
        return this.currentPage / this.pageCount;
    }

    toggleBookmark() {
        this.readingStore.toggleBookmark(this.epoc.id, Math.ceil(this.getProgress() * 100));
    }

    isBookmarked() {
        if (this.reading) {
            return this.reading.bookmarks.indexOf(Math.ceil(this.getProgress() * 100)) !== -1;
        }
        return false;
    }

    displayMenu() {
        this.presentActionSheet();
    }

    stopAllMedia() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            cssClass: 'custom-action-sheet',
            mode: 'ios',
            header: this.epoc.title,
            subHeader: 'Score : 25/100',
            buttons: [
                {
                    text: 'Accueil',
                    icon: 'home',
                    handler: () => {
                        this.router.navigate(['/']);
                    }
                },
                {
                    cssClass: 'splitter'
                },
                {
                    text: 'Poser un signet',
                    icon: 'bookmark',
                    handler: () => {
                        this.toggleBookmark();
                    }
                },
                {
                    text: 'Liste des signets',
                    icon: 'bookmarks',
                    handler: () => {
                        this.router.navigateByUrl('/player/bookmarks/' + this.epoc.id);
                    }
                },
                {
                    text: 'Tables des matières',
                    icon: 'list',
                    handler: () => {
                        this.router.navigateByUrl('/player/toc/' + this.epoc.id);
                    }
                }, /*
                {
                    text: 'Pages',
                    icon: 'book'
                }, */
                {
                    cssClass: 'splitter'
                },
                {
                    text: 'Détails des scores',
                    icon: 'podium',
                    handler: () => {
                        this.router.navigateByUrl('/player/score/' + this.epoc.id);
                    }
                },
                {
                    cssClass: 'splitter'
                },
                {
                    text: 'Paramètres',
                    icon: 'cog',
                    handler: () => {
                        this.router.navigateByUrl('/player/settings');
                    }
                },
                {
                    text: 'Fermer',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    getStyle() {
        return {
            'font-family': this.settings.font,
            'font-size': this.settings.fontSize + 'px',
            'line-height': this.settings.lineHeight
        };
    }

    getScoreTotal(content) {
        return content.items.reduce((total, item) => item.score + total, 0);
    }
}
