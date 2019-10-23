import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';

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
        public alertController: AlertController
    ) {}

    async moreInfo() {
        const alert = await this.alertController.create({
            header: this.epoc.title,
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
                        this.open();
                    }
                }
            ]
        });

        await alert.present();
    }

    open() {
        this.router.navigateByUrl('/player');
    }

    delete() {
        this.deleteItem.emit(true);
    }
}
