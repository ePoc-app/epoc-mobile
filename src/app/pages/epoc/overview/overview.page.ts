import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {AlertController} from '@ionic/angular';
import {Content} from 'src/app/classes/contents/content';
import {EpocService} from '../../../services/epoc.service';

@Component({
    selector: 'app-epoc-overview',
    templateUrl: 'overview.page.html',
    styleUrls: ['overview.page.scss']
})
export class EpocOverviewPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    contents: Content[] = [];
    selectedTab = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
        });
    }

    isReading(id) {
        return this.readingStore.readings.findIndex(reading => reading.epocId === id) !== -1;
    }

    openEpoc(id) {
        this.router.navigateByUrl('/epoc/play/' + id);
    }

    selectTab(index) {
        this.selectedTab = index;
    }

    async downloadEpoc(id) {
        const alert = await this.alertController.create({
            header: 'Confirm download',
            message: 'This ePoc will take 500 Mo ',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.router.navigateByUrl('/epoc/download/' + id);
                    }
                }
            ]
        });

        await alert.present();
    }

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}
