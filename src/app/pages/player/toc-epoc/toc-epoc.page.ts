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
    selector: 'app-toc-epoc',
    templateUrl: 'toc-epoc.page.html',
    styleUrls: ['toc-epoc.page.scss']
})
export class TocEpocPage implements OnInit{

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    detailedToc = false;

    sliderOptions = {
        slidesPerView: 1.2,
        spaceBetween: 25,
    };

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
        });
    }

    getContentsFromOutline(outline) {
        return outline.reduce((toc, id) => {
            const content = this.epoc.content.find(item => item.id === id);
            if (content && content.toc) {
                toc.push(content);
            }
            return toc;
        }, []);
    }
}
