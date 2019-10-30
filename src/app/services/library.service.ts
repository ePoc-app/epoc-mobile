import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {MockLibrary} from '../classes/mock-library';
import {Epoc} from '../classes/epoc';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    constructor() {}

    getLibrary(): Observable<Epoc[]> {
        return of(MockLibrary);
    }
}
