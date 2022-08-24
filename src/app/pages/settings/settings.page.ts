import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Settings} from 'src/app/classes/settings';
import {AlertController, ToastController} from '@ionic/angular';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import {User} from 'src/app/classes/user';
import {mode} from 'src/environments/environment.mode';
import { Device} from '@capacitor/device';
import { App, AppInfo } from '@capacitor/app';
import {LibraryService} from '../../services/library.service';
import {MatomoTracker} from '@ngx-matomo/tracker';


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
        darkMode: false,
        libraryMode: 'libraryUrl',
        devMode: false
    };
    info: AppInfo;
    user: User;
    mode = mode;
    private devModeCount = 0;
    isUserOptIn = true;

    constructor(
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        private libraryService: LibraryService,
        public alertController: AlertController,
        public toastController: ToastController,
        private router: Router,
        private auth: AuthService,
        private ref: ChangeDetectorRef,
        private readonly tracker: MatomoTracker
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

        App.getInfo().then((info) => {
            this.info = info;
        }).catch(() => {
            this.info = {
                id: 'fr.inria.epoc',
                name: 'epoc',
                version: '0.0.0',
                build: 'dev'
            }
        });

        this.tracker.isUserOptedOut().then((isUserOptOut) => {
            this.isUserOptIn = !isUserOptOut;
        })
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

    async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000
        });
        toast.present();
    }

    async setUser(){
        if (this.mode === 'inria') {
            this.router.navigateByUrl('/login');
            return;
        }
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

    throwError() {
        this.presentToast('Une erreur a été émise');
        throw new Error(`Test Thrown Error`);
    }

    libraryChanged(event) {
        this.settings.libraryMode = event.detail.value;
        this.settingsChanged()
    }

    disableDevMode($event) {
        if ($event) return;
        this.settings.libraryMode = 'libraryUrl';
        this.settingsChanged()
    }

    setDevMode(event) {
        event.stopPropagation();
        this.devModeCount++;
        if (this.devModeCount >= 10){
            this.settings.devMode = true;
            this.settingsChanged();
        }
    }

    resetDevModeCount() {
        this.devModeCount = 0;
    }

    trackerToggle() {
        if (this.isUserOptIn) {
            this.tracker.optUserOut();
            this.isUserOptIn = false;
        } else {
            this.tracker.forgetUserOptOut();
            this.isUserOptIn = true;
        }
    }
}
