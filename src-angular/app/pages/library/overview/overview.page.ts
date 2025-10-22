import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LibraryService} from 'src/app/services/library.service';
import {EpocLibrary} from 'src/app/classes/epoc';
import {AppService} from 'src/app/services/app.service';
import {LocalEpocsService} from 'src/app/services/localEpocs.service';
import {combineLatest} from 'rxjs';

@Component({
    selector: 'app-epoc-overview',
    templateUrl: 'overview.page.html',
    styleUrls: ['overview.page.scss']
})
export class EpocOverviewPage implements OnInit {
    epocProgresses : {[EpocId: string] : number} = {};
    epoc: EpocLibrary;
    selectedTab = 0;
    rootFolder = '';

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService,
        public localEpocsService: LocalEpocsService,
        public appService: AppService,
    ) {}

    ngOnInit() {
        if (this.route.snapshot.paramMap.get('dir')) {
            this.localEpocsService.localEpocs$.subscribe((data: EpocLibrary[]) => {
                const dir = `local-epocs/${this.route.snapshot.paramMap.get('dir')}`;
                this.epoc = data.find(epoc => epoc.dir === dir);
                if (this.epoc) this.rootFolder = this.epoc.rootFolder;
            });
        } else {
            combineLatest([
                this.libraryService.officialCollections$,
                this.libraryService.customCollections$
            ]).subscribe(([officialCollections, customCollections]) => {
                const collections = { ...customCollections, ...officialCollections };
                const collection = collections[this.route.snapshot.paramMap.get('libraryId')];
                const ePocId = this.route.snapshot.paramMap.get('id');
                if (collection && collection.ePocs[ePocId]) {
                    this.epoc = collection.ePocs[ePocId];
                }
            });
        }
        this.libraryService.epocProgresses$.subscribe((epocProgresses) => {
            this.epocProgresses = epocProgresses;
            this.ref.detectChanges();
        });
    }

    openEpoc(id) {
        this.router.navigateByUrl('/epoc/play/' + id);
    }

    selectTab(index) {
        this.selectedTab = index;
    }

    downloadEpoc(epoc: EpocLibrary) {
        this.libraryService.downloadEpoc(epoc, this.route.snapshot.paramMap.get('libraryId'));
    }

    openEpocMenu(epoc){
        this.libraryService.epocLibraryMenu(epoc);
    }

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }

}
