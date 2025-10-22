import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Settings} from 'src/app/classes/settings';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Location} from '@angular/common';
import {EpocService} from 'src/app/services/epoc.service';
import {Content} from 'src/app/classes/contents/content';
import {MatomoTracker} from '@ngx-matomo/tracker';
import {AppService} from 'src/app/services/app.service';


@Component({
    selector: 'app-epoc-orphan-player',
    templateUrl: 'orphan-player.page.html',
    styleUrls: ['player.page.scss']
})
export class EpocOrphanPlayerPage implements OnInit {
    epoc$: Observable<Epoc>;
    epoc: Epoc;
    content: Content;

    iconFromType = {
        html: 'document-text-outline',
        assessment: 'cube-outline',
        video: 'play-circle-outline',
        audio: 'mic-outline',
        'simple-question': 'help-outline',
        choice: 'git-branch-outline'
    };

    // Reader
    dataInitialized = false;

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
        });

        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.dataInitialized = true;

                this.content = this.epoc.contents[this.route.snapshot.paramMap.get('contentId')];
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

    updateFocus() {
        if(this.appService.screenReaderDetected) {
            (document.querySelector('app-epoc-player.ion-page:not(.ion-page-hidden) .reader') as HTMLElement).focus();
        }
    }
}
