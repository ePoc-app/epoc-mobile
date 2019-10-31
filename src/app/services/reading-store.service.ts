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
        const readings = await this.readingService.get();
        this.readings = readings ? JSON.parse(readings) : [];
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

    removeReading(id: string) {
        this.readings = this.readings.filter(reading => reading.epocId !== id);
        this.saveReadings();
    }
}
