import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController, Platform} from '@ionic/angular';
import {DenormalizePipe} from "../../../pipes/denormalize.pipe";

@Component({
    selector: 'app-toc-epoc',
    templateUrl: 'toc-epoc.page.html',
    styleUrls: ['toc-epoc.page.scss']
})
export class TocEpocPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    detailedToc = false;
    chaptersFinished: Array<boolean> = [];
    assesmentDone: Array<boolean> = [];

    sliderOptions = {
        slidesPerView: 1.2,
        spaceBetween: 25,
    };
    fontSize: any;
    height: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService,
        public alertController: AlertController,
        private platform: Platform
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc())
        );
        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.updateToc();
            // Listener déclenché à chaque modification du storage
            if (window.addEventListener) {
                window.addEventListener('storage', this.updateToc, false);
            }
            const length = DenormalizePipe.prototype.transform(this.epoc.chapters).length;
            this.height =
                (this.platform.height() - 44 - (this.platform.height() / length) - 12 * (length + 1)) / (length);
            if (length < 7) {
                this.fontSize = this.height / 4.5;
            } else {
                this.fontSize = this.height / 3.5;
            }
        });
    }

    private updateToc = () => {
        this.chaptersFinished = JSON.parse(localStorage.getItem('chapterProgression'));
        this.assesmentDone = JSON.parse(localStorage.getItem('assessmentProgression'));
    }
}
