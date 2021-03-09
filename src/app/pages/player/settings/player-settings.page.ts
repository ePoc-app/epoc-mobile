import {Component, OnInit} from '@angular/core';
import {SettingsStoreService} from '../../../services/settings-store.service';
import {Settings} from '../../../classes/settings';
import {AlertController} from '@ionic/angular';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {User} from '../../../classes/user';
import {mode} from '../../../../environments/environment.mode';
import {Plugins} from '@capacitor/core';
import {DeviceInfo} from '@capacitor/core/dist/esm/core-plugin-definitions';

const {Device} = Plugins;

@Component({
    selector: 'app-player-settings',
    templateUrl: 'player-settings.page.html',
    styleUrls: ['player-settings.page.scss']
})
export class PlayerSettingsPage implements OnInit {

    settings: Settings = {
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.4,
        darkMode: false
    };

    info: DeviceInfo;
    user: User;
    mode = mode;

    constructor(
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController,
        private router: Router,
        private auth: AuthService
    ) {

        this.settingsStore.settings$.subscribe(settings => {
            if (settings) {
                this.settings = settings;
            }
        });
    }

    ngOnInit() {
        this.auth.getUser().subscribe(user => {
            this.user = user;
        });

        Device.getInfo().then((info) => {
            this.info = info;
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

    logout() {
        this.auth.setUser(null).then(() => {
            this.router.navigateByUrl('/login');
        });
    }
}
