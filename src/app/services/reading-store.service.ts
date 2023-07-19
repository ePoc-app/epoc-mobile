import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Reading, Statements, Verb} from 'src/app/classes/reading';
import {StorageService} from './storage.service';
import {uid} from '@epoc/epoc-types/dist/v1';
import {Badge} from 'src/app/classes/epoc';
import * as jsonLogic from 'json-logic-js/logic';
import {ToastController} from '@ionic/angular';
import {EpocService} from './epoc.service';

@Injectable({
    providedIn: 'root'
})
export class ReadingStoreService {

    private readonly readingsSubject = new BehaviorSubject<Reading[]>(undefined);
    readonly readings$ = this.readingsSubject.asObservable();

    constructor(
        private storageService: StorageService,
        private epocService: EpocService,
        private toastController: ToastController
    ) {
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
                    chaptersProgress: [],
                    assessments: [],
                    bookmarks: [],
                    choices: [],
                    flags: [],
                    certificateShown: false,
                    statements: {
                        contents: {}
                    },
                    badges: []
                }
            ];

            this.saveReadings();
        }
    }

    updateProgress(epocId: string, progress: number) {
        const readings = [...this.readings];
        const index = readings.findIndex(reading => reading.epocId === epocId);

        readings[index].progress = progress;
        this.readings = readings;
        this.saveReadings();
    }

    saveResponses(epocId: string, assessmentId: string, score: number, responses) {
        const readings = [...this.readings];
        const index = readings.findIndex(reading => reading.epocId === epocId);

        const assessmentIndex = readings[index].assessments.findIndex(assessment => assessment.id === assessmentId);

        if (assessmentIndex !== -1) {
            readings[index].assessments[assessmentIndex] = {
                id: assessmentId,
                score,
                responses
            };
        } else {
            readings[index].assessments.push({
                id: assessmentId,
                score,
                responses
            });
        }
        this.readings = readings;
        this.saveReadings();
    }

    saveChapterProgress(epocId: string, chapterId: string, contentId?: string) {
        const index = this.readings.findIndex(reading => reading.epocId === epocId);

        const chapterIndex = this.readings[index].chaptersProgress.findIndex(chapter => chapter.id === chapterId);

        if (chapterIndex !== -1) {
            if (contentId && this.readings[index].chaptersProgress[chapterIndex].contents.indexOf(contentId) === -1) {
                this.readings[index].chaptersProgress[chapterIndex].contents.push(contentId)
            }
        } else {
            this.readings[index].chaptersProgress.push({
                id: chapterId,
                contents: [contentId]
            });
        }

        this.saveReadings();
    }

    saveChoices(epocId: string, choiceId: string, responses, flags, flagsToRemove) {
        const readings = [...this.readings];
        const index = readings.findIndex(reading => reading.epocId === epocId);
        const choiceIndex = readings[index].choices.findIndex(assessment => assessment.id === choiceId);

        if (choiceIndex !== -1) {
            readings[index].choices[choiceIndex] = {
                id: choiceId,
                responses
            };
        } else {
            readings[index].choices.push({
                id: choiceId,
                responses
            });
        }
        readings[index].flags = readings[index].flags.filter(flag => flagsToRemove.indexOf(flag) === -1);
        readings[index].flags = readings[index].flags.concat(flags);

        this.readings = readings;
        this.saveReadings();
    }

    resetResponses(epocId: string, assessmentId) {
        const readings = [...this.readings];
        const index = readings.findIndex(reading => reading.epocId === epocId);
        const assessmentIndex = readings[index].assessments.findIndex(assessment => assessment.id === assessmentId);

        readings[index].assessments.splice(assessmentIndex, 1);
        this.readings = readings;
        this.saveReadings();
    }

    saveStatement(epocId: uid, contentId: uid, verb: Verb, value: string|number|boolean) {
        const readings = [...this.readings];
        const reading = readings.find(r => r.epocId === epocId);
        if (!reading.statements) reading.statements = {contents:{}}
        if (!reading.statements.contents[contentId]) reading.statements.contents[contentId] = {}
        reading.statements.contents[contentId][verb] = value;
        if (!reading.badges) reading.badges = [];
        this.checkBadges(reading);
        this.readings = readings;
        this.saveReadings();
    }

    checkBadges (reading: Reading) {
        const epoc = this.epocService.epoc;
        for (const [badgeId, badge] of Object.entries(epoc.badges)) {
            if (jsonLogic.apply(badge.rule, reading.statements) && !reading.badges.includes(badgeId)) {
                this.presentBadge(badge).then(() => {});
                reading.badges.push(badgeId);
            }
        }
        console.log(reading.badges);
    }

    async presentBadge(badge: Badge) {
        const toast = await this.toastController.create({
            message: badge.title,
            duration: 1500,
            position: 'top'
        });

        await toast.present();
    }

    removeReading(id: string) {
        this.readings = this.readings.filter(reading => reading.epocId !== id);
        this.saveReadings();
    }

    resetAll() {
        this.readings = this.readings.map((reading) => {
            reading.progress = 0;
            reading.chaptersProgress = [];
            reading.assessments = [];
            reading.bookmarks = [];
            reading.choices = [];
            reading.flags = [];
            reading.certificateShown = false;
            return reading;
        });
        this.saveReadings();
    }

    toggleBookmark(epocId: string, index: number) {
        const readings = [...this.readings];
        const readingIndex = readings.findIndex(reading => reading.epocId === epocId);
        if (readings[readingIndex].bookmarks.indexOf(index) === -1) {
            readings[readingIndex].bookmarks.push(index);
        } else {
            readings[readingIndex].bookmarks.splice(readings[readingIndex].bookmarks.indexOf(index), 1);
        }
        this.readings = readings;
        this.saveReadings();
    }

    removeBookmark(epocId: string, index: number) {
        const readings = [...this.readings];
        const readingIndex = readings.findIndex(reading => reading.epocId === epocId);

        readings[readingIndex].bookmarks.splice(index, 1);
        this.readings = readings;
        this.saveReadings();
    }

    updateCertificateShown(epocId: string, value: boolean) {
        const readings = [...this.readings];
        const index = readings.findIndex(reading => reading.epocId === epocId);
        readings[index].certificateShown = value;
        this.readings = readings;
        this.saveReadings();
    }
}
