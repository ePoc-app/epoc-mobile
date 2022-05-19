import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Chapter, Epoc} from 'src/app/classes/epoc';
import {EpocService} from '../../../services/epoc.service';
import {PluginService} from '../../../services/plugin.service';

@Component({
    selector: 'app-epoc-preview',
    templateUrl: 'preview.page.html',
    styleUrls: ['preview.page.scss']
})
export class EpocPreviewPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    chapters: Chapter[];
    chapterLabel: string;

    iconFromType = {
        html: 'document-text-outline',
        assessment: 'cube-outline',
        video: 'play-circle-outline',
        'simple-question': 'help-outline',
        choice: 'git-branch-outline'
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public epocService: EpocService,
        private pluginService: PluginService
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.chapters = Object.values(this.epoc.chapters);
            this.chapterLabel = epoc.parameters?.chapterParameter?.toLowerCase() || 'chapitre';
            this.pluginService.init(epoc.plugins)
        });
    }

    ionViewDidEnter(){
        document.body.classList.add('preview')
    }

    ionViewWillLeave(){
        document.body.classList.remove('preview')
    }
}
