import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class ReadingService {
    constructor(private storage: Storage) {
    }

    get() {
        return this.storage.get('readings');
    }

    set(value: string) {
        this.storage.set('readings', value);
    }
}
