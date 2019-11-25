import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {MockLibrary} from '../classes/mock-library';
import {Epoc} from '../classes/epoc';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    constructor() {}

    getLibrary(): Observable<Epoc[]> {
        return of(MockLibrary);
    }

    getEpoc(id: string): Observable<Epoc> {
        return this.getLibrary().pipe(
            map((epocs: Epoc[]) => MockLibrary.find(item => item.id === id))
        );
    }
}
