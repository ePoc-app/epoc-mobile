import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Observable} from 'rxjs';
import {Epoc, EpocLibrary} from 'src/app/classes/epoc';
import {AlertController} from '@ionic/angular';
import {Content} from 'src/app/classes/contents/content';
import {EpocService} from '../../../services/epoc.service';
import {LibraryService} from '../../../services/library.service';

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

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService
    ) {}

    ngOnInit() {
        this.libraryService.library$.subscribe((data: EpocLibrary[]) => {
            this.library = data;
            this.epoc = this.library.find(epoc => epoc.id === this.route.snapshot.paramMap.get('id'))
        });
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

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}
