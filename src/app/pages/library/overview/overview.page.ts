import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {LibraryService} from 'src/app/services/library.service';
import {Observable} from 'rxjs';
import {Epoc, EpocMetadata} from 'src/app/classes/epoc';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Content} from 'src/app/classes/contents/content';

@Component({
    selector: 'app-epoc-overview',
    templateUrl: 'overview.page.html',
    styleUrls: ['overview.page.scss']
})
export class EpocOverviewPage implements OnInit {

    library: EpocMetadata[] | undefined;
    epoc: EpocMetadata;
    selectedTab = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService
    ) {}

    ngOnInit() {
        this.libraryService.getLibrary().subscribe((data: EpocMetadata[]) => {
            this.library = [...data];
            this.epoc = this.library.find(epoc => epoc.id === this.route.snapshot.paramMap.get('id'))
        });
    }

    openEpoc(id) {
        this.router.navigateByUrl('/epoc/play/' + id);
    }

    selectTab(index) {
        this.selectedTab = index;
    }

    async downloadEpoc(id) {
        // todo
    }

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}
