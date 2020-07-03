import {Component} from '@angular/core';
import {SettingsStoreService} from '../../../services/settings-store.service';
import {Settings} from '../../../classes/settings';
import {AlertController} from '@ionic/angular';
import {ReadingStoreService} from '../../../services/reading-store.service';

@Component({
    selector: 'app-player-settings',
    templateUrl: 'player-settings.page.html',
    styleUrls: ['player-settings.page.scss']
})
export class PlayerSettingsPage {

    settings: Settings = {
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.4,
        darkMode: false
    };

    constructor(
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController
    ) {

        this.settingsStore.settings$.subscribe(settings => {
            if (settings) {
                this.settings = settings;
            }
        });
    }

    getStyle() {
        return {
            'font-family': this.settings.font,
            'font-size': this.settings.fontSize + 'px',
            'line-height': this.settings.lineHeight
        };
    }

    settingsChanged() {
        this.settingsStore.updateSettings(this.settings);
    }

    async deleteData() {
        const alert = await this.alertController.create({
            header: 'Confirmation',
            message: 'Cette action effacera <strong>toutes vos données</strong> de l\'application (progression, score, exercices)',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.readingStore.resetAll();
                    }
                }
            ]
        });

        await alert.present();
    }
}
