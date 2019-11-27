import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Reading} from '../classes/reading';
import {Epoc} from '../classes/epoc';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class ReadingStoreService {

    private readonly readingsSubject = new BehaviorSubject<Reading[]>([]);
    readonly readings$ = this.readingsSubject.asObservable();

    constructor(private storageService: StorageService) {
        this.fetchReadings();
    }

    get readings(): Reading[] {
        return this.readingsSubject.getValue();
    }

    set readings(val: Reading[]) {
        this.readingsSubject.next(val);
    }

    async fetchReadings() {
        const readings = await this.storageService.getValue('readings');
        this.readings = readings ? JSON.parse(readings) : [];
    }

    saveReadings() {
        this.storageService.setValue('readings', JSON.stringify(this.readings));
    }

    addReading(epoc: Epoc) {
        if (this.readings.findIndex(reading => reading.epocId === epoc.id) === -1) {
            this.readings = [
                ...this.readings,
                {
                    epocId: epoc.id,
                    progress: 0,
                    score: 0,
                    responses: [],
                    bookmarks: []
                }
            ];

            this.saveReadings();
        }
    }

    updateProgress(epocId: string, progress: number) {
        const index = this.readings.findIndex(reading => reading.epocId === epocId);

        this.readings[index].progress = progress > this.readings[index].progress ? progress : this.readings[index].progress;

        this.saveReadings();
    }

    updateScore(epocId: string, addscore: number) {
        const index = this.readings.findIndex(reading => reading.epocId === epocId);

        this.readings[index].score += addscore;
    }

    removeReading(id: string) {
        this.readings = this.readings.filter(reading => reading.epocId !== id);
        this.saveReadings();
    }

    toggleBookmark(epocId: string, index: number) {
        const readingIndex = this.readings.findIndex(reading => reading.epocId === epocId);
        if (this.readings[readingIndex].bookmarks.indexOf(index) === -1) {
            this.readings[readingIndex].bookmarks.push(index);
        } else {
            this.readings[readingIndex].bookmarks.splice(this.readings[readingIndex].bookmarks.indexOf(index), 1);
        }

        this.saveReadings();
    }
}
