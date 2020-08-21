import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController} from '@ionic/angular';

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
        public libraryService: LibraryService,
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
}
