import {Component, OnInit} from '@angular/core';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Settings} from 'src/app/classes/settings';
import {AlertController, ToastController} from '@ionic/angular';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import {User} from 'src/app/classes/user';
import {mode} from 'src/environments/environment.mode';
import {Plugins} from '@capacitor/core';
import {DeviceInfo} from '@capacitor/core/dist/esm/core-plugin-definitions';
import {LibraryService} from '../../services/library.service';

const {Device} = Plugins;

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {

    settings: Settings = {
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.5,
        darkMode: false
    };

    info: DeviceInfo;
    user: User;
    mode = mode;

    constructor(
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        private libraryService: LibraryService,
        public alertController: AlertController,
        public toastController: ToastController,
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
            header: 'Êtes vous sûr ?',
            message: 'Cette action effacera <strong>toutes vos données</strong> de l\'application <br/><small>(ePocs, progression, exercices, préférences, etc.)</small>',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.readingStore.resetAll();
                        this.libraryService.deleteAll().subscribe(() => this.presentToast());
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Les données ont bien été supprimées',
            duration: 2000
        });
        toast.present();
    }

    logout() {
        this.auth.setUser(null).then(() => {
            this.router.navigateByUrl('/login');
        });
    }
}
