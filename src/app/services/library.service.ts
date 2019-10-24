import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AlertController, ToastController} from '@ionic/angular';

import {MockLibrary, MockReading} from '../classes/mock-library';
import {Epoc} from '../classes/epoc';

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

    async addItemFromFile() {
        const toast = await this.toastController.create({
            message: 'Feature not available yet.',
            duration: 2000
        });
        toast.present();
    }

    async addItemFromUrl() {
        const toast = await this.toastController.create({
            message: 'Feature not available yet.',
            duration: 2000
        });
        const alert = await this.alertController.create({
            header: 'Download Epoc',
            inputs: [
                {
                    name: 'url',
                    type: 'text',
                    placeholder: 'Epoc download URL'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        toast.present();
                    }
                }
            ]
        });

        alert.present();
    }

    deleteItem(index: number) {
        MockLibrary.splice(index, 1);
    }

    addItemToReading(readingEpoc) {
        if (MockReading.indexOf(readingEpoc) === -1) {
            MockReading.push(readingEpoc);
        }
    }

    getReading(): Observable<Epoc[]> {
        return of(MockReading);
    }
}
