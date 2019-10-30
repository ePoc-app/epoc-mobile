import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Reading} from '../classes/reading';
import {Epoc} from '../classes/epoc';
import {ReadingService} from './reading.service';

@Injectable({
    providedIn: 'root'
})
export class ReadingStoreService {

    private readonly readingsSubject = new BehaviorSubject<Reading[]>([]);
    readonly readings$ = this.readingsSubject.asObservable();

    constructor(private readingService: ReadingService) {
        this.fetchReadings();
    }

    get readings(): Reading[] {
        return this.readingsSubject.getValue();
    }

    set readings(val: Reading[]) {
        this.readingsSubject.next(val);
    }

    async fetchReadings() {
        this.readings = JSON.parse(await this.readingService.get());
    }

    saveReadings() {
        this.readingService.set(JSON.stringify(this.readings));
    }

    addReading(epoc: Epoc) {
        if (this.readings.findIndex(reading => reading.epocId === epoc.id) === -1) {
            this.readings = [
                ...this.readings,
                {
                    epocId: epoc.id,
                    progress: 0.1,
                    score: 0,
                    responses: []
                }
            ];

            this.saveReadings();
        }
    }

    removeReading(index: number) {
        this.readings.splice(index, 1);
        this.saveReadings();
    }
}
