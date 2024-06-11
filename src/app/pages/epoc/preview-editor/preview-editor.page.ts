import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Epoc} from 'src/app/classes/epoc';
import {switchMap} from 'rxjs/operators';
import {EpocService} from 'src/app/services/epoc.service';

@Component({
    selector: 'app-epoc-preview-editor',
    templateUrl: 'preview-editor.page.html',
    styleUrls: ['../../library/overview/overview.page.scss']
})
export class EpocPreviewEditorPage implements OnInit {
    epoc: Epoc;
    selectedTab = 0;

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        public epocService: EpocService
    ) {}

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        ).subscribe(epoc => {
            this.epoc = epoc;
        });
    }

    selectTab(index) {
        this.selectedTab = index;
    }

    ionViewWillLeave() {
        const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
        medias.forEach((media) => {
            media.pause();
        });
    }
}
