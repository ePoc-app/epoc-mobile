import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {LibraryService} from 'src/app/services/library.service';
import {ReadingStoreService} from 'src/app/services/reading-store.service';

@Component({
    selector: 'library-item',
    templateUrl: 'library-item.component.html',
    styleUrls: ['library-item.component.scss']
})
export class LibraryItemComponent {
    @Input('epoc') epoc;
    @Input('displayToolbar') displayToolbar;
    @Input('progress') progress;

    constructor(
        private router: Router,
        public libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        public actionSheetController: ActionSheetController,
        public alertController: AlertController
    ) {}

    async moreInfo() {
        const actions = await this.actionSheetController.create({
            header: this.epoc.title,
            mode: 'ios',
            cssClass: 'custom-action-sheet',
            buttons: [{
                text: 'About this course',
                icon: 'ios-arrow-forward',
                handler: () => {
                    this.router.navigateByUrl('/epoc/overview/' + this.epoc.id);
                }
            }, {
                text: 'Score',
                icon: 'checkbox-outline',
                handler: () => {
                    this.router.navigateByUrl('/epoc/score/' + this.epoc.id);
                }
            }, {
                text: 'Delete',
                icon: 'trash',
                role: 'destructive',
                handler: () => {
                    this.delete();
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }]
        });

        await actions.present();
    }

    open() {
        if (this.readingStore.readings.findIndex(reading => reading.epocId === this.epoc.id) === -1) {
            this.router.navigateByUrl('/epoc/overview/' + this.epoc.id);
        } else {
            this.router.navigateByUrl('/epoc/play/' + this.epoc.id);
        }
    }

    async delete() {
        const alert = await this.alertController.create({
            header: 'Confirm deletion',
            message: 'Are you sure to delete "' + this.epoc.title + '" ? You will loose your current progress and answers.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.readingStore.removeReading(this.epoc.id);
                    }
                }
            ]
        });

        await alert.present();
    }
}
