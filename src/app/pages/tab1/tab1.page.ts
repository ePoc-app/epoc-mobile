import {Component, OnInit} from '@angular/core';
import {Epoc} from '../../classes/epoc';
import {LibraryService} from '../../services/library.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    library: Epoc[];
    reading: Epoc[];

    constructor(
        private libraryService: LibraryService
    ) {

    }

    ngOnInit() {
        this.libraryService.getLibrary().subscribe(library => this.library = library);
        this.libraryService.getReading().subscribe(reading => this.reading = reading);
    }

    async addFromFile() {
        await this.libraryService.addItemFromFile();
    }

    async addFromUrl() {
        await this.libraryService.addItemFromUrl();
    }

    onDeleteItem(index: number) {
        this.libraryService.deleteItem(index);
    }
}
