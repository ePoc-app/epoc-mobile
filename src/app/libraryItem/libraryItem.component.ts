import {Component, EventEmitter, Input, Output} from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

@Component({
    selector: 'library-item',
    templateUrl: 'libraryItem.component.html',
    styleUrls: ['libraryItem.component.scss']
})
export class LibraryItemComponent {
    @Input('item') item;
    @Output() deleteItem = new EventEmitter<boolean>();

    constructor(
        public alertController: AlertController,
        public toastController: ToastController,
        private file: File
    ) {}

    async moreInfo() {
        const toast = await this.toastController.create({
            message: 'Feature not available yet.',
            duration: 2000
        });
        const alert = await this.alertController.create({
            header: this.item.name,
            message: '',
            buttons: [
                {
                    text: 'Delete',
                    handler: () => {
                        this.delete();
                    }
                }, {
                    text: 'Open',
                    handler: () => {
                        toast.present();
                    }
                }
            ]
        });

        await alert.present();
    }


    delete() {
        this.file.removeFile(this.file.externalDataDirectory, this.item.filename).then(result => {
            this.deleteItem.emit(true);
        });
    }
}
