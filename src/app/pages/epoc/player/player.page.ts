import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonSlides} from '@ionic/angular';
import {switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Chapter, Epoc} from 'src/app/classes/epoc';
import {Reading} from 'src/app/classes/reading';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Settings} from 'src/app/classes/settings';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Location} from '@angular/common';
import {Assessment} from 'src/app/classes/contents/assessment';
import {uid} from 'src/app/classes/types';
import {DenormalizePipe} from 'src/app/pipes/denormalize.pipe';
import {EpocService} from '../../../services/epoc.service';
import {Content} from '../../../classes/contents/content';

@Component({
    selector: 'app-epoc-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class EpocPlayerPage implements OnInit {

    @ViewChild('readerSlides', {static: false}) readerSlides: IonSlides;

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    chapterLabel: string;
    chapterId: uid;
    chapterIndex: number;
    chapter: Chapter;
    nextChapter: Chapter;
    nextChapterId: uid;
    pagesCount: number;
    reading: Reading;
    contentsFilteredConditional: Content[];

    iconFromType = {
        html: 'document-text-outline',
        assessment: 'cube-outline',
        video: 'play-circle-outline',
        'simple-question': 'help-outline',
        choice: 'git-branch-outline'
    };

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
    showControls = true;

    // Reading default settings
    settings: Settings = {
        debug:false,
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
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        private settingsStore: SettingsStoreService
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.chapterId = this.route.snapshot.paramMap.get('chapter');
            this.chapterIndex = Object.keys(epoc.chapters).indexOf(this.chapterId);
            this.chapter = epoc.chapters[this.chapterId];
            this.assessments = epoc.assessments;
            this.chapterLabel = epoc.parameters?.chapterParameter?.toLowerCase() || 'chapitre';

            if (this.chapterIndex < Object.entries(epoc.chapters).length - 1) {
                this.nextChapterId = Object.keys(epoc.chapters)[this.chapterIndex + 1]
                this.nextChapter = epoc.chapters[this.nextChapterId];
                this.nextChapter.id = this.nextChapterId;
            }
        });

        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.reading = readings.find(item => item.epocId === this.epoc.id);
                if (!this.reading) this.readingStore.addReading(this.epoc.id);
                this.dataInitialized = true;
                this.loading = false;

                const contentId = this.route.snapshot.paramMap.get('contentId');
                // Go to the next content after contentId
                const next = !!this.route.snapshot.paramMap.get('next');

                this.contentsFilteredConditional = this.chapter.initializedContents.filter((content) => { // filter out conditional content
                    return !content.conditional || (content.conditional && this.reading.flags.indexOf(content.id) !== -1);
                });

                if (contentId) {
                    const pageIndex = this.contentsFilteredConditional.findIndex(content => content.id === contentId);
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
        this.pagesCount = this.contentsFilteredConditional.length + 1;
    }

    ionViewDidEnter() {
        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.setAssessmentsData();
            }
        });
    }

    hideControls(){
        this.showControls = false;
    }

    toggleControls($event){
        if (['ion-icon', 'button', 'ion-button', 'ion-icon', 'ion-checkbox', 'ion-radio', 'span'].includes(
            $event.detail.target.tagName.toLowerCase()
        )) return;
        this.showControls = !this.showControls;
    }

    onSlideChange() {
        this.stopAllMedia();
        this.readerSlides.getActiveIndex().then((index) => {
            this.currentPage = index;
            this.countPages();
            this.progress = index / this.pagesCount;
            this.readingStore.saveChapterProgress(this.epoc.id, this.chapterId, 'todo');
        });
    }

    prevPage() {
        this.readerSlides.slidePrev();
    }

    nextPage() {
        this.readerSlides.slideNext();
    }

    // /!\ this event is binded from videplayer and dragable element
    onDrag(event) {
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
        this.router.navigateByUrl('/epoc/score/' + this.epoc.id);
    }

    setAssessmentsData() {
        this.assessmentData = {
            totalUserScore: 0,
            totalScore: 0
        };

        this.assessments.forEach((assessment) => {
            const userAssessment = this.reading.assessments.find(a => assessment.id === a.id);
            const scoreTotal = this.epocService.calcScoreTotal(this.epoc, assessment.questions);

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
                icon: 'home-outline',
                handler: () => {
                    this.router.navigateByUrl('/home/' + this.epoc.id);
                }
            },
            {
                text: 'À propos du cours',
                icon: 'information-circle-outline',
                handler: () => {
                    this.router.navigateByUrl('/library/' + this.epoc.id);
                }
            },
            {
                text: 'Table des matières',
                icon: 'list-circle-outline',
                handler: () => {
                    this.router.navigateByUrl('/epoc/toc/' + this.epoc.id);
                }
            },
            {
                text: 'Détails des scores',
                icon: 'star-outline',
                handler: () => {
                    this.router.navigateByUrl('/epoc/score/' + this.epoc.id);
                }
            },
            {
                text: 'Paramètres',
                icon: 'settings-outline',
                handler: () => {
                    this.router.navigateByUrl('/settings');
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
}
