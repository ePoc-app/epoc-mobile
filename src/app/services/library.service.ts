import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AlertController, ToastController} from '@ionic/angular';

import {MockLibrary, MockReading} from '../classes/mock-library';
import {Epoc} from '../classes/epoc';
import {Reading} from '../classes/reading';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    constructor(
        public alertController: AlertController,
        public toastController: ToastController
    ) {
    }

    getLibrary(): Observable<Epoc[]> {
        return of(MockLibrary);
    }

    getReading(): Observable<Reading[]> {
        return of(MockReading);
    }

    deleteItem(index: number) {
        MockReading.splice(index, 1);
    }

    addItemToReading(epoc) {
        if (MockReading.findIndex(reading => reading.epocId === epoc.id) === -1) {
            const reading = {
                epocId: epoc.id,
                progress : 0.1,
                score : 0,
                responses : []
            };
            MockReading.push(reading);
        }
    }
}
