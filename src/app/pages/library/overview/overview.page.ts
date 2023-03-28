import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LibraryService} from 'src/app/services/library.service';
import {EpocLibrary} from 'src/app/classes/epoc';
import {AppService} from 'src/app/services/app.service';
import {Capacitor} from '@capacitor/core';
import {LocalEpocsService} from '../../../services/localEpocs.service';

@Component({
    selector: 'app-epoc-overview',
    templateUrl: 'overview.page.html',
    styleUrls: ['overview.page.scss']
})
export class EpocOverviewPage implements OnInit {

    library: EpocLibrary[] | undefined;
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
            this.libraryService.library$.subscribe((data: EpocLibrary[]) => {
                this.library = data;
                this.epoc = this.library.find(epoc => epoc.id === this.route.snapshot.paramMap.get('id'))
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
        this.libraryService.downloadEpoc(epoc);
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
