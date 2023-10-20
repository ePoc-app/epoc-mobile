import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first, switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Chapter, Epoc} from 'src/app/classes/epoc';
import {Reading} from 'src/app/classes/reading';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Settings} from 'src/app/classes/settings';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Location} from '@angular/common';
import {Assessment, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {uid} from '@epoc/epoc-types/src/v1';
import {EpocService} from 'src/app/services/epoc.service';
import {Content} from 'src/app/classes/contents/content';
import {PluginService} from 'src/app/services/plugin.service';
import {MatomoTracker} from '@ngx-matomo/tracker';
import {IonicSlides} from '@ionic/angular';
import {AppService} from 'src/app/services/app.service';


@Component({
    selector: 'app-epoc-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class EpocPlayerPage implements OnInit {

    @ViewChild('readerSlides', {static: false}) readerSlides: ElementRef;
    swiperModules = [IonicSlides];

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
    currentPage = 0;
    progress = 0;

    assessments: (SimpleQuestion | Assessment)[];
    assessmentData;
    certificateShown = false;
    showControls = true;

    settings: Settings;

    readerStyles = {
        'font-family': 'Inria Sans',
        'font-size': '16px',
        'line-height': 1.4
    };

    constructor(
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        private settingsStore: SettingsStoreService,
        private pluginService: PluginService,
        private readonly tracker: MatomoTracker,
        public appService: AppService,
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

            this.pluginService.init(epoc.plugins);

            this.readingStore.saveStatement(this.epoc.id, 'chapters', this.chapterId, 'started', true);
        });

        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.reading = readings.find(item => item.epocId === this.epoc.id);
                if (!this.reading) this.readingStore.addReading(this.epoc.id);
                this.dataInitialized = true;

                this.contentsFilteredConditional = this.chapter.initializedContents.filter((content) => { // filter out conditional content
                    return !content.conditional || (content.conditional && this.reading.flags.indexOf(content.id) !== -1);
                });

                this.readingStore.saveChapterProgress(this.epoc.id, this.chapterId);
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
        this.readerSlides?.nativeElement?.swiper?.updateSlides();
    }

    ionViewWillEnter() {
        const contentId = this.route.snapshot.paramMap.get('contentId');
        if (contentId) {
            this.dataInitialized = false
        }
    }

    ionViewDidEnter() {
        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.setAssessmentsData();
            }
        });
        combineLatest([this.epoc$, this.readingStore.readings$]).pipe(first()).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                const contentId = this.route.snapshot.paramMap.get('contentId');
                this.dataInitialized = true;

                if (contentId) {
                    setTimeout(() => {
                        this.goTo(contentId, 0);
                    }, 0);
                }
            }
        });
        this.updateFocus();
    }

    hideControls(){
        if(!this.appService.screenReaderDetected) {
            this.showControls = false;
        }
    }

    toggleControls($event){
        if (['ion-icon', 'button', 'ion-button', 'ion-icon', 'ion-checkbox', 'ion-radio', 'span'].includes(
            $event.target.tagName.toLowerCase()
        )) return;
        if(!this.appService.screenReaderDetected) {
            this.showControls = !this.showControls;
        }
    }
    updateCurrentContent(index){
        const content = this.chapter.initializedContents.filter(
            c => !c.conditional || ( c.conditional && this.reading.flags.indexOf(c.id) !== -1 )
        )[index - 1]
        if (content) {
            this.location.go('/epoc/play/'+this.epoc.id+'/'+this.chapterId+'/content/'+content.id)
            this.readingStore.saveChapterProgress(this.epoc.id, this.chapterId, content.id);
            this.tracker.trackPageView();
            this.readingStore.saveStatement(this.epoc.id, 'pages', content.id, 'viewed', true);
            if (content.type === 'html') {
                this.readingStore.saveStatement(this.epoc.id, 'contents', content.id, 'read', true);
            }
        }
    }

    onSlideChange() {
        this.stopAllMedia();
        const index = this.readerSlides.nativeElement.swiper.activeIndex;
        this.currentPage = index;
        this.countPages();
        this.updateCurrentContent(index);
        this.progress = index / this.pagesCount;
    }

    updateFocus() {
        if(this.appService.screenReaderDetected) {
            (document.querySelector('app-epoc-player.ion-page:not(.ion-page-hidden) .reader') as HTMLElement).focus();
        }
    }

    prevPage() {
        this.readerSlides.nativeElement.swiper.slidePrev();
    }

    nextPage() {
        this.readerSlides.nativeElement.swiper.slideNext();
    }

    goTo(contentId: uid, time?: number) {
        // Go to the next content after contentId
        const next = !!this.route.snapshot.paramMap.get('next');
        const pageIndex = this.contentsFilteredConditional.findIndex(content => content.id === contentId);
        const index = next ? pageIndex + 2 : pageIndex + 1; // If next: go to the next content after id

        this.countPages();

        if (this.readerSlides && this.readerSlides.nativeElement.swiper) {
            this.readerSlides.nativeElement.swiper.slideTo(index, time);
        }
        this.currentPage = index;
        this.progress = pageIndex / this.pagesCount;
    }

    // /!\ this event is binded from videplayer and dragable element
    onDrag(event) {
        if (event === 'dragstart') {
            this.readerSlides.nativeElement.swiper.disable()
        } else {
            this.readerSlides.nativeElement.swiper.enable();
        }
    }

    displayMenu() {
        this.epocService.epocMainMenu(this.chapterIndex, this.chapter);
    }

    stopAllMedia() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
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

    ionViewWillLeave() {
        this.stopAllMedia();
    }
}
