import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Reading} from '../classes/reading';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class ReadingStoreService {

    private readonly readingsSubject = new BehaviorSubject<Reading[]>(undefined);
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

    fetchReadings() {
        this.storageService.getValue('readings').then( (readings) => {
            this.readings = readings ? JSON.parse(readings) : [];
        });
    }

    saveReadings() {
        this.storageService.setValue('readings', JSON.stringify(this.readings));
    }

    addReading(epocId) {
        if (this.readings.findIndex(reading => reading.epocId === epocId) === -1) {
            this.readings = [
                ...this.readings,
                {
                    epocId,
                    progress: 0,
                    assessments: [],
                    bookmarks: []
                }
            ];

            this.saveReadings();
        }
    }

    updateProgress(epocId: string, progress: number) {
        const index = this.readings.findIndex(reading => reading.epocId === epocId);

        this.readings[index].progress = progress;

        this.saveReadings();
    }

    saveResponses(epocId: string, assessmentId: string, score: number, responses) {
        const index = this.readings.findIndex(reading => reading.epocId === epocId);

        const assessmentIndex = this.readings[index].assessments.findIndex(assessment => assessment.id === assessmentId);

        if (assessmentIndex !== -1) {
            this.readings[index].assessments[assessmentIndex] = {
                id: assessmentId,
                score,
                responses
            };
        } else {
            this.readings[index].assessments.push({
                id: assessmentId,
                score,
                responses
            });
        }

        this.saveReadings();
    }

    resetResponses(epocId: string, assessmentId) {
        const index = this.readings.findIndex(reading => reading.epocId === epocId);
        const assessmentIndex = this.readings[index].assessments.findIndex(assessment => assessment.id === assessmentId);

        this.readings[index].assessments.splice(assessmentIndex, 1);

        this.saveReadings();
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

    removeBookmark(epocId: string, index: number) {
        const readingIndex = this.readings.findIndex(reading => reading.epocId === epocId);

        this.readings[readingIndex].bookmarks.splice(index, 1);

        this.saveReadings();
    }
}
