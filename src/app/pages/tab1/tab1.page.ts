import {Component, OnInit} from '@angular/core';
import {Epoc} from '../../classes/epoc';
import {Reading} from '../../classes/reading';
import {LibraryService} from '../../services/library.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    library: Epoc[];
    readings: Reading[];

    slidesOptions = {
        slidesPerView: 2.2
    };

    constructor(
        private libraryService: LibraryService
    ) {

    }

    ngOnInit() {
        this.libraryService.getLibrary().subscribe(library => this.library = library);
        this.libraryService.getReading().subscribe(readings => this.readings = readings);
    }

    onDeleteItem(index: number) {
        this.libraryService.deleteItem(index);
    }

    getEpoc(reading) {
        return this.library.find(epoc => epoc.id === reading.epocId);
    }
}
