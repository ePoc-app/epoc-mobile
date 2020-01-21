import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonSlides, Platform} from '@ionic/angular';
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

    @ViewChild('slides', { static: false }) protected slider: IonSlides;

    epoc$: Observable<Epoc>;

    readings: Reading[];

    slidesOptions = {
        slidesPerView: 2,
        spaceBetween: 0,
        initialSlide: 0,
        autoHeight: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        breakpoints: {
            600: {
                slidesPerView: 1.05
            }
        }
    };

    // Styles
    fontSize = 12;
    contentStyles = {'font-size' : this.fontSize + 'px'};

    // Render
    pagesWrapper = null;
    rendering = true;
    splittedContent = [];
    currentPage = 0;
    pageCount = 0;
    renderStartTime = 0;
    renderEndTime = null;
    currentPageHtml = '';
    lastInserted = '';
    openedTags = [];

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

        this.slidesOptions.initialSlide = +this.route.snapshot.paramMap.get('page');
        this.currentPage = +this.route.snapshot.paramMap.get('page');
    }

    ngAfterViewInit() {
        const player = this;
        this.epoc$.subscribe({
            next(epoc) {
                setTimeout(() => {
                    player.processContent(epoc.content);
                }, 200);
            }
        });
    }

    processContent(contents) {
        this.pagesWrapper = this.elRef.nativeElement.querySelector('.pages-wrapper');
        let htmlContents = '';

        contents.forEach((content) => {
            if (content.type === 'html') {
                htmlContents += content.value;
            }
        });

        this.splittedContent = this.splitContent(htmlContents);
        this.renderContent();
    }

    resetRender() {
        this.pagesWrapper.innerHTML = '';
        this.rendering = true;
        this.currentPage = 0;
        this.pageCount = 0;
        this.renderStartTime = performance.now();
        this.renderEndTime = null;
        this.currentPageHtml = '';
        this.lastInserted = '';
        this.openedTags = [];
    }

    renderContent() {
        this.resetRender();

        const  currentPageContent = this.addPage(null);
        this.pagesWrapper.appendChild(currentPageContent.parentNode);

        this.fillPage(currentPageContent, this.splittedContent.slice(0));
    }

    fillPage(currentPageContent, splittedContent) {
        this.lastInserted = splittedContent.shift();

        // if is opening tag
        if (this.lastInserted.match(/<[a-z]+.*>/gm)) {
            this.openedTags.push(this.lastInserted);
        // if is closing tag
        } else if (this.lastInserted.match(/<\/[a-z]+.*>/gm)) {
            this.openedTags.pop();
        }

        const previousPageHtml = this.currentPageHtml;
        this.currentPageHtml += this.lastInserted + ' ';
        currentPageContent.innerHTML = this.currentPageHtml;

        if (this.checkOverflow(currentPageContent)) {
            splittedContent.unshift(this.lastInserted);
            currentPageContent.innerHTML = previousPageHtml;
            this.currentPageHtml = this.openedTags.join();
            this.openedTags = [];
            currentPageContent = this.addPage(currentPageContent);
        }

        if (splittedContent.length > 0) {
            this.fillPage(currentPageContent, splittedContent);
        } else {
            this.renderEndTime = performance.now();
            this.rendering = false;
        }
    }

    addPage(currentPageContent) {
        const newPageContainer = document.createElement('div');
        const newPageContent = document.createElement('div');

        this.pageCount++;
        newPageContainer.className = 'page page-' + this.pageCount;
        newPageContent.className = 'page-content';
        newPageContainer.appendChild(newPageContent);

        if (currentPageContent) {
            currentPageContent.parentNode.after(newPageContainer);
        }

        return newPageContent;
    }

    checkOverflow(element) {
        return element.parentNode.clientHeight < element.clientHeight;
    }

    indexOfMultiple(str, compare) {
        // finds index of first occurence of a character in compare
        for ( let i = 0; i < str.length; i++ ) {
            const c = str.charAt(i);
            for ( let j = 0; j < compare.length; j++ ) {
                if ( c === compare[ j ] ) {
                    return i;
                }
            }
        }
        return str.length;
    }

    splitContent(content) {
        // split the content into an array of tags containing arrays of words
        content = content.replace(/(\r\n\t|\n|\r\t)/gm, '');
        const words = [];
        while ( content.length > 0 ) {
            if ( content.charAt( 0 ) === '<' ) {
                words.push( content.substr( 0, content.indexOf( '>') + 1 ) );
                content = content.substr( content.indexOf( '>') + 1 ).trim();
            }
            const next = this.indexOfMultiple( content, ' <' );
            words.push( content.substr( 0, next ) );
            content = content.substr( next ).trim();
        }
        return words;
    }

    changeFontSize(delta) {
        this.fontSize = this.fontSize + delta;
        this.contentStyles = {'font-size' : this.fontSize + 'px'};
        this.rendering = true;

        setTimeout(() => {
            this.renderContent();
        }, 1);
    }

    onSubmit(epoc: Epoc, assessment: Assessment, responses) {
        const errors = assessment.items.some((question, index) => {
            return question.correctResponse !== responses[question.type + '-' + index];
        });
        const currentReading = this.readingStore.readings.find(reading => reading.epocId === epoc.id);

        if (errors) {
            this.displayTryagain = true;
            this.displaySubmit = false;
        } else {
            this.displaySubmit = false;
            this.displayResume = true;

            if (!currentReading.responses[assessment.id]) {
                this.readingStore.updateScore(epoc.id, assessment.score);
            }
        }

        this.readingStore.saveResponses(epoc.id, assessment.id, responses);
    }

    initSlide(epoc) {
        const currentReading = this.readingStore.readings.find(reading => reading.epocId === epoc.id);
        this.isBookmarked = currentReading.bookmarks.indexOf(this.currentPage) !== -1;
    }

    slideChanged(epoc) {
        this.slider.getActiveIndex().then((index) => {
            this.currentPage = index;
            this.readingStore.updateProgress(epoc.id, (index + 1) / epoc.content.length);
            const currentReading = this.readingStore.readings.find(reading => reading.epocId === epoc.id);
            this.isBookmarked = currentReading.bookmarks.indexOf(this.currentPage) !== -1;

            if (epoc.content[this.currentPage].type === 'assessment') {
                const assessment = epoc.content[this.currentPage];
                this.displaySubmit = true;
                if (currentReading.responses[assessment.id]) {
                    this.onSubmit(epoc, assessment, currentReading.responses[assessment.id]);
                }
            }
        });
    }

    beforeSlideChanged() {
        this.displaySubmit = false;
        this.isBookmarked = false;
        this.displayTryagain = false;
        this.displayResume = false;
        this.elRef.nativeElement.querySelectorAll('video').forEach((video) => video.pause());
    }

    resume() {
        this.slider.isEnd().then((isEnd) => {
            if (!isEnd) {
                this.displaySubmit = true;
                this.displayResume = false;
                this.slider.slideNext();
            }
        });
    }

    tryAgain(epoc: Epoc, assessment: Assessment, assessmentForm: NgForm) {
        this.displaySubmit = true;
        this.displayTryagain = false;
        this.readingStore.resetResponses(epoc.id, assessment.id);
        assessmentForm.reset();
    }

    toggleBookmark() {
        this.readingStore.toggleBookmark(this.route.snapshot.paramMap.get('id'), this.currentPage);
        this.isBookmarked = !this.isBookmarked;
    }
}
