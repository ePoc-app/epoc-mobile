import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {ActionSheetController, AlertController} from '@ionic/angular';

@Component({
    selector: 'app-toc-epoc',
    templateUrl: 'toc-epoc.page.html',
    styleUrls: ['toc-epoc.page.scss']
})
export class TocEpocPage implements OnInit{

    epoc$: Observable<Epoc>;

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
    }
}
