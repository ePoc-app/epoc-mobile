import {Component, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, DoCheck} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {switchMap, debounceTime} from 'rxjs/operators';
import {combineLatest, Observable, fromEvent} from 'rxjs';
import {Epoc} from '../../classes/epoc';
import {Reading} from '../../classes/reading';
import {ReadingStoreService} from '../../services/reading-store.service';
import {LibraryService} from '../../services/library.service';
import {Content} from '../../classes/contents/content';
import {Settings} from '../../classes/settings';
import {SettingsStoreService} from '../../services/settings-store.service';
import {Location} from '@angular/common';
import {Assessment} from '../../classes/contents/assessment';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage implements OnInit, DoCheck {

    @ViewChildren('node') nodes: QueryList<ElementRef>;
    @ViewChild('pageContainer', {static: true}) pageContainer: ElementRef;
    @ViewChild('pageWrapper', {static: true}) pageWrapper: ElementRef;

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    contents: Content[] = [];
    reading: Reading;

    // Reader
    dataInitialized = false;
    readerInitialized = false;
    loading = true;
    pagePerView = Math.ceil(window.innerWidth / 640);
    columnWidth = (100 / this.pagePerView - 2) + 'vw';
    currentPage = 0;
    pageCount = 1;
    progress = 0;

    // Reading default settings
    settings: Settings = {
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.4,
        darkMode: false
    };

    readerStyles = {
        'font-family': this.settings.font,
        'font-size': this.settings.fontSize + 'px',
        'line-height': this.settings.lineHeight
    };

    constructor(
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        public alertController: AlertController,
        public actionSheetController: ActionSheetController,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        private settingsStore: SettingsStoreService
    ) {
        fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe(() => {
            this.resize();
        });
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
            this.initContent();
        });

        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.readingStore.addReading(this.epoc.id);
                this.dataInitialized = true;
            }
        });

        this.settingsStore.settings$.subscribe(settings => {
            if (settings) {
                this.settings = settings;
                this.readerStyles = {
                    'font-family': this.settings.font,
                    'font-size': this.settings.fontSize + 'px',
                    'line-height': this.settings.lineHeight
                };
            }
        });

        fromEvent(this.pageContainer.nativeElement, 'scroll').pipe(debounceTime(200)).subscribe(() => {
            this.calcCurrentPage();
        });
    }

    ngDoCheck(): void {
        if (!this.readerInitialized && this.dataInitialized && this.pageWrapper.nativeElement.scrollWidth > 0) {
            this.readerInitialized = true;
            // Go to progress (percentage)
            const progress = this.route.snapshot.paramMap.has('progress') && !Number.isNaN(+this.route.snapshot.paramMap.get('progress')) ?
                +this.route.snapshot.paramMap.get('progress') : this.reading.progress;
            // Go to specific content
            const contentId = this.route.snapshot.paramMap.get('contentId');
            this.initReader(progress, contentId);
        }
    }

    initContent() {
        let currentChapter;

        this.epoc.parts.forEach((part) => {
            const contents = part.outline.map((id) => {
                const currentContent = this.epoc.content.find(item => item.id === id);

                if (currentContent.type === 'chapter') {
                    currentChapter = currentContent;
                    currentChapter.time = 0;
                    currentChapter.videoCount = 0;
                    currentChapter.assessmentCount = 0;
                } else if (currentContent.type === 'assessment') {
                    (currentContent as Assessment).scoreTotal = (currentContent as Assessment).items.reduce(
                        (total, item) => item.score + total, 0
                    );
                }

                if (currentChapter) {
                    if (currentContent.type === 'video') {
                        currentChapter.videoCount++;
                        currentChapter.time = currentChapter.time + 3;
                    } else if (currentContent.type === 'assessment') {
                        currentChapter.time = currentChapter.time + (currentContent as Assessment).items.length;
                        currentChapter.assessmentCount++;
                    }
                }
                return currentContent;
            });
            this.contents = this.contents.concat(contents);
        });
    }

    resize() {
        this.initReader();
    }

    initReader(progress?: number, contentId?: string) {
        this.pagePerView = Math.ceil(window.innerWidth / 768);
        this.columnWidth = (100 / this.pagePerView - 2) + 'vw';
        this.pageCount = this.getPageCount();
        if (contentId) {
            const contentElem = this.nodes.find((elem) => elem.nativeElement.id === 'content-' + contentId).nativeElement;
            contentElem.scrollIntoView();
            this.calcCurrentPage();
        } else if (progress) {
            this.changeCurrentPage(Math.floor(progress / 100 * this.pageCount));
            this.goToPage(this.currentPage);
            this.location.replaceState('/player/play/' + this.epoc.id);
        } else {
            this.calcCurrentPage();
        }
        this.loading = false;
    }

    getPageCount() {
        const elem = this.elRef.nativeElement.querySelector('.pages-wrapper');
        return Math.ceil(elem.scrollWidth / elem.clientWidth) * this.pagePerView - this.pagePerView - 1;
    }

    changeCurrentPage(page) {
        if (this.currentPage !== page) {
            this.currentPage = page;
            this.progress = this.currentPage / this.pageCount;
            this.stopAllMedia();
        }
    }

    calcCurrentPage() {
        let nearestPage = 0;
        let smallestGap = 9999999;
        for (let i = 0; i < this.pageCount + 1; i++) {
            const gap = Math.abs(i * window.innerWidth / this.pagePerView - this.pageContainer.nativeElement.scrollLeft);
            if (gap < smallestGap) {
                smallestGap = gap;
                nearestPage = i;
            }
        }
        this.changeCurrentPage(nearestPage);
        this.goToPage(nearestPage);
    }

    goToPage(pageNumber) {
        this.pageContainer.nativeElement.scrollTo({
            left: (pageNumber * ((window.innerWidth / this.pagePerView) + 1) as number),
            behavior: 'smooth'
        });
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.changeCurrentPage(this.currentPage - 1);
            this.goToPage(this.currentPage);
        }
    }

    nextPage() {
        if (this.currentPage < this.pageCount) {
            this.changeCurrentPage(this.currentPage + 1);
            this.goToPage(this.currentPage);
        }
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
}
