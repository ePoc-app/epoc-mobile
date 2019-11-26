import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LibraryService} from '../../services/library.service';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Epoc} from '../../classes/epoc';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage implements OnInit {

    epoc$: Observable<Epoc>;

    slidesOptions = {
        spaceBetween: 0
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private libraryService: LibraryService,
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );
    }
}
