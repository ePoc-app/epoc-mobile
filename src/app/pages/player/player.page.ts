import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonSlides} from '@ionic/angular';
import {switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Chapter, Epoc} from '../../classes/epoc';
import {Reading} from '../../classes/reading';
import {ReadingStoreService} from '../../services/reading-store.service';
import {LibraryService} from '../../services/library.service';
import {Settings} from '../../classes/settings';
import {SettingsStoreService} from '../../services/settings-store.service';
import {Location} from '@angular/common';
import {Assessment} from '../../classes/contents/assessment';
import {uid} from '../../classes/types';
import {DenormalizePipe} from '../../pipes/denormalize.pipe';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage implements OnInit {

    @ViewChild('readerSlides', {static: false}) readerSlides: IonSlides;

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    chapterId: uid;
    chapterIndex: number;
    chapter: Chapter;
    nextChapter: Chapter;
    nextChapterId: uid;
    pagesCount: number;
    reading: Reading;
    chaptersFinished: Array<boolean> = [];
    assessmentDone: Array<boolean> = [];

    // Reader
    dataInitialized = false;
    loading = true;
    currentPage = 0;
    progress = 0;
    slidesOptions = {
        slidesPerView: window.innerWidth > window.innerHeight ? 2 : 1,
        initialSlide: 0
    };

    assessments: Assessment[];
    assessmentData;
    certificateShown = false;

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
        public libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        private settingsStore: SettingsStoreService
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc())
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.chapterId = this.route.snapshot.paramMap.get('chapter');
            this.chapterIndex = Object.keys(epoc.chapters).indexOf(this.chapterId);
            this.chapter = epoc.chapters[this.chapterId];
            this.assessments = epoc.assessments;

            if (this.chapterIndex < Object.entries(epoc.chapters).length - 1) {
                this.nextChapterId = Object.keys(epoc.chapters)[this.chapterIndex + 1]
                this.nextChapter = epoc.chapters[this.nextChapterId];
            }
            // Initialize the array chaptersFinished
            if (!this.chaptersFinished) {
                this.chaptersFinished = [];
                DenormalizePipe.prototype.transform(this.epoc.chapters).forEach(() => {
                    this.chaptersFinished.push(false);
                })
                localStorage.setItem('chapterProgression', JSON.stringify(this.chaptersFinished));
            }
            // Initialize the array assessmentDone
            if (!JSON.parse(localStorage.getItem('assessmentProgression'))) {
                this.assessmentDone = [];
                DenormalizePipe.prototype.transform(this.epoc.chapters).forEach((chapter) => {
                    if (chapter.assessmentCount !== 0) {
                        this.assessmentDone.push(false);
                    } else {
                        this.assessmentDone.push(true);
                    }
                })
                localStorage.setItem('assessmentProgression', JSON.stringify(this.assessmentDone));
            }
        });

        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.reading = pair.reading.find(item => item.epocId === this.epoc.id);
                this.readingStore.addReading(this.epoc.id);
                this.dataInitialized = true;
                this.loading = false;

                const contentId = this.route.snapshot.paramMap.get('contentId');
                // Go to the next content after contentId
                const next = !!this.route.snapshot.paramMap.get('next');

                if (contentId) {
                    const pageIndex = this.chapter.contents.findIndex(id => id === contentId);
                    this.slidesOptions.initialSlide = next ? pageIndex + 2 : pageIndex + 1; // If next: go to the next content after id
                    this.countPages();
                    this.progress = pageIndex / this.pagesCount
                }
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
    }

    countPages() {
        this.pagesCount = this.chapter.initializedContents.filter(
            content => !content.conditional || (content.conditional && this.reading.flags.indexOf(content.id) !== -1)
        ).length + 1;
    }

    ionViewDidEnter() {
        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.setAssessmentsData();
            }
        });
    }

    onSlideChange() {
        this.stopAllMedia();
        this.readerSlides.getActiveIndex().then((index) => {
            this.currentPage = index;
            this.countPages();
            this.progress = index / this.pagesCount;
            // Quand on arrive sur la dernière page de chaque chapitre
            if (index === this.pagesCount) {
                this.updateToc(this.chapter);
            }
        });
    }

    prevPage() {
        this.readerSlides.slidePrev();
    }

    nextPage() {
        this.readerSlides.slideNext();
    }

    // /!\ this event is binded from videplayer
    timelineDragging(event) {
        if (event === 'dragstart') {
            this.readerSlides.lockSwipes(true);
        } else {
            this.readerSlides.lockSwipes(false);
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

    goToCertificate() {
        this.dismissCertificateCard();
        this.router.navigateByUrl('/player/score/' + this.epoc.id);
    }

    setAssessmentsData() {
        this.assessmentData = {
            totalUserScore: 0,
            totalScore: 0
        };

        this.assessments.forEach((assessment) => {
            const userAssessment = this.reading.assessments.find(a => assessment.id === a.id);
            const scoreTotal = this.libraryService.calcScoreTotal(this.epoc, assessment.questions);

            if (userAssessment && userAssessment.score > 0) {
                this.assessmentData.totalUserScore += userAssessment.score;
            }
            this.assessmentData.totalScore += scoreTotal;
        });

        if (this.assessmentData.totalUserScore >= this.epoc.certificateScore) {
            this.showCertificateCard();
        }
    }

    showCertificateCard() {
        if (!this.reading.certificateShown) {
            this.certificateShown = true;
            this.readingStore.updateCertificateShown(this.epoc.id, true);
        }
    }

    dismissCertificateCard() {
        this.certificateShown = false;
    }

    async presentActionSheet() {
        const buttons = [
            {
                text: 'Accueil',
                icon: 'home',
                handler: () => {
                    this.router.navigateByUrl('/home/' + this.epoc.id);
                }
            },
            {
                cssClass: 'splitter'
            },
            {
                text: 'À propos du cours',
                icon: 'reader-outline',
                handler: () => {
                    this.router.navigateByUrl('/player/about/' + this.epoc.id);
                }
            },
            {
                cssClass: 'splitter'
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
        ];
        const actionSheet = await this.actionSheetController.create({
            cssClass: 'custom-action-sheet',
            mode: 'ios',
            header: this.epoc.title,
            subHeader: `${this.chapterIndex + 1}. ${this.chapter.title}`,
            buttons
        });
        await actionSheet.present();
    }

    ionViewWillLeave() {
        this.stopAllMedia();
    }

    updateToc(chapter) {
        if (JSON.parse(localStorage.getItem('chapterProgression'))) {
            this.chaptersFinished = JSON.parse(localStorage.getItem('chapterProgression'));
        }
        this.chaptersFinished[DenormalizePipe.prototype.transform(this.epoc.chapters).indexOf(chapter)] = true;
        localStorage.setItem('chapterProgression', JSON.stringify(this.chaptersFinished));
    }
}
