import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Chapter, Epoc, EpocLibrary} from 'src/app/classes/epoc';
import {EpocService} from 'src/app/services/epoc.service';
import {PluginService} from 'src/app/services/plugin.service';
import {LibraryService} from 'src/app/services/library.service';

@Component({
    selector: 'app-epoc-preview',
    templateUrl: 'preview.page.html',
    styleUrls: ['preview.page.scss']
})
export class EpocPreviewPage implements OnInit {
    library: EpocLibrary[] | undefined;
    epocId: string;
    epoc$: Observable<Epoc>;
    epoc: Epoc;
    chapters: Chapter[];
    selectedTab = 0;

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
        public libraryService: LibraryService
    ) {
    }

    ngOnInit() {
        this.libraryService.library$.subscribe((data: EpocLibrary[]) => { this.library = data; });
        this.route.paramMap.subscribe((params) => {
            if (params.get('id')){
                this.epocId = this.route.snapshot.paramMap.get('id')
                this.fetchEpocData()
            } else {
                this.epocId = null;
                this.epoc = null;
            }
        })
    }

    fetchEpocData () {
        this.epoc$ = this.epocService.getEpoc(this.epocId)
        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.chapters = Object.values(this.epoc.chapters);
        });
    }

    ionViewDidEnter(){
        document.body.classList.add('preview')
        setTimeout(() => {
            document.body.querySelectorAll<HTMLInputElement>('.accordion [name="accordion-checkbox"]')
                .forEach(checkbox => checkbox.checked = true)
        }, 1000)
    }

    ionViewWillLeave(){
        document.body.classList.remove('preview')
    }

    selectTab(index) {
        this.selectedTab = index;
    }
}
