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
        debug:false,
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
            console.log(user);
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
            message: 'Cette action effacera les données des exercices de l\'application <br/><small>(attestations, quiz, préférences, etc.)</small>',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.readingStore.resetAll();
                        this.settingsStore.resetSettings();
                        this.auth.setUser(null);
                        this.user = null;
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

    async setUser(){
        const alert = await this.alertController.create({
            header: 'Renseigner vos informations',
            message: 'Ces informations serviront à l\'édition des attestations',
            inputs: [
                {
                    name: 'lastname',
                    type: 'text',
                    placeholder: 'Nom',
                },
                {
                    name: 'firstname',
                    type: 'text',
                    placeholder: 'Prenom',
                }
            ],
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: (data) => {
                        this.user = {firstname:data.firstname, lastname: data.lastname , username: null, email: null};
                        this.auth.setUser(this.user);
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
