import {Component, OnInit, ViewChild} from '@angular/core';
import {Epoc} from '../../classes/epoc';
import {Reading} from '../../classes/reading';
import {LibraryService} from '../../services/library.service';
import {ReadingStoreService} from '../../services/reading-store.service';
import {IonSlides, Platform} from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    @ViewChild('slidesReadings', { static: false }) protected sliderReadings: IonSlides;
    @ViewChild('slidesLibrary', { static: false }) protected sliderLibrary: IonSlides;

    library: Epoc[];
    readings: Reading[];

    slidesOptions = {
        slidesPerView: this.platform.width() / 230 // adapt number of slides based on device width
    };

    constructor(
        public platform: Platform,
        public libraryService: LibraryService,
        private readingStore: ReadingStoreService
    ) {
        this.InitPlatformIfReady();
    }

    ngOnInit() {
        this.libraryService.getLibrary().subscribe(library => this.library = library);
        this.readingStore.readings$.subscribe(readings => this.readings = readings);
    }

    InitPlatformIfReady() {
        this.platform.ready().then(() => {
            this.platform.resize.subscribe(() => {
                this.sliderReadings.getSwiper().then((swiper) => {
                    swiper.params.slidesPerView = this.platform.width() / 230;
                    swiper.update();
                });
                this.sliderLibrary.getSwiper().then((swiper) => {
                    swiper.params.slidesPerView = this.platform.width() / 230;
                    swiper.update();
                });
            });
        });
    }

    getEpoc(reading) {
        return this.library.find(epoc => epoc.id === reading.epocId);
    }
}
