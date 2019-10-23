import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ActionSheetController, AlertController} from '@ionic/angular';

@Component({
    selector: 'library-item',
    templateUrl: 'libraryItem.component.html',
    styleUrls: ['libraryItem.component.scss']
})
export class LibraryItemComponent {
    @Input('epoc') epoc;
    @Output() deleteItem = new EventEmitter<boolean>();

    constructor(
        private router: Router,
        public actionSheetController: ActionSheetController,
        public alertController: AlertController
    ) {}

    async moreInfo() {
        const actions = await this.actionSheetController.create({
            header: this.epoc.title,
            mode: 'ios',
            cssClass: 'custom-action-sheet',
            buttons: [{
                text: 'Open',
                icon: 'ios-arrow-forward',
                handler: () => {
                    this.open();
                }
            }, {
                text: 'Score',
                icon: 'checkbox-outline',
                handler: () => {
                    this.open();
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
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });

        await actions.present();
    }

    open() {
        this.router.navigateByUrl('/player');
    }

    async delete() {
        const alert = await this.alertController.create({
            header: 'Confirm deletion',
            message: 'Are you sure to delete "' + this.epoc.title + '" ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.deleteItem.emit(true);
                    }
                }
            ]
        });

        await alert.present();
    }
}
