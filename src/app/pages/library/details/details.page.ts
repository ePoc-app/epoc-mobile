import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';
import {EpocCollection, EpocLibrary} from 'src/app/classes/epoc';
import {AppService} from 'src/app/services/app.service';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController, AlertController, IonicSlides} from '@ionic/angular';
import {LocalEpocsService} from 'src/app/services/localEpocs.service';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';

@Component({
    selector: 'app-library-details',
    templateUrl: './details.page.html',
    styleUrls: ['../library.page.scss', './details.page.scss'],
})
export class LibraryDetailsPage implements OnInit {
    @ViewChild('file', {static: false}) fileRef: ElementRef;
    swiperModules = [IonicSlides];

    collection: EpocCollection;

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService,
        public appService: AppService,
        public translate: TranslateService,
        public actionSheetController: ActionSheetController,
        public alertController: AlertController,
        public localEpocsService: LocalEpocsService
    ) {}

    ngOnInit() {
        combineLatest([
            this.libraryService.officialCollections$,
            this.libraryService.customCollections$
        ]).subscribe(([officialCollections, customCollections]) => {
            const collections = { ...customCollections, ...officialCollections };
            const collection = collections[this.route.snapshot.paramMap.get('libraryId')];
            if (collection) {
                this.collection = collection;
            } else {
                this.router.navigateByUrl('/library');
            }
        });
    }

    downloadEpoc(epoc: EpocLibrary, libraryId?: string) {
        this.libraryService.downloadEpoc(epoc, libraryId);
    }

    doRefresh(event) {
        const startTime = performance.now();
        this.libraryService.fetchCustomCollections();
        this.localEpocsService.fetchLocalEpocs();
        this.libraryService.officialCollections$.subscribe(() => {
            const endTime = performance.now();
            const delay = Math.max(0, 500 - (endTime - startTime)); // minimum delay of 500ms
            setTimeout(() => {
                event.target.complete();
            }, delay);
        });
    }

    async openEpocMenu(epoc, libraryId?: string){
        await this.libraryService.epocLibraryMenu(epoc, libraryId);
    }

    ionViewDidEnter() {
        if(this.appService.screenReaderDetected) {
            const content = document.querySelector('.library-items') as HTMLElement;
            content.focus();
        }
    }
}
