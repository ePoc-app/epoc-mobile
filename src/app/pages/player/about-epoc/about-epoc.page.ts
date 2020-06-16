import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Content} from '../../../classes/contents/content';

@Component({
    selector: 'app-about-epoc',
    templateUrl: 'about-epoc.page.html',
    styleUrls: ['about-epoc.page.scss']
})
export class AboutEpocPage implements OnInit{

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    contents: Content[] = [];
    chapterCount = 0;
    assessmentCount = 0;
    hasPlayed = false;
    selectedTab = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;

            epoc.parts.forEach((part) => {
                const contents = part.outline.map((id) => {
                    const currentContent = epoc.content.find(item => item.id === id);
                    if (currentContent.type === 'chapter') {
                        this.chapterCount++;
                    } else if (currentContent.type === 'assessment') {
                        this.assessmentCount++;
                    }
                    return currentContent;
                });
                this.contents = this.contents.concat(contents);
            });
        });
    }

    isReading(id) {
        return this.readingStore.readings.findIndex(reading => reading.epocId === id) !== -1;
    }

    openEpoc(id) {
        this.router.navigateByUrl('/player/play/' + id);
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
                        this.router.navigateByUrl('/player/download/' + id);
                    }
                }
            ]
        });

        await alert.present();
    }

    togglePlay($event) {
        const video = $event.target.nodeName === 'VIDEO' ? $event.target : $event.target.querySelector('video');
        if (video.paused) {
            video.play();
            this.hasPlayed = true;
        } else {
            video.pause();
        }
    }

    play($event) {
        $event.target.parentNode.classList.add('playing');
    }

    pause($event) {
        $event.target.parentNode.classList.remove('playing');
    }

    selectTab(index) {
        this.selectedTab = index;
    }
}
