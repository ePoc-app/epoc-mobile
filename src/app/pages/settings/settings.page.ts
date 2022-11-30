import {Component, OnInit} from '@angular/core';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Settings} from 'src/app/classes/settings';
import {AlertController, ToastController} from '@ionic/angular';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import {User} from 'src/app/classes/user';
import {mode} from 'src/environments/environment.mode';
import {environment as env} from 'src/environments/environment';
import {App, AppInfo} from '@capacitor/app';
import {LibraryService} from '../../services/library.service';
import {MatomoTracker} from '@ngx-matomo/tracker';
import {TranslateService} from '@ngx-translate/core';
import {languages} from 'src/environments/languages';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {

    settings: Settings;
    info: AppInfo;
    user: User;
    mode = mode;
    private devModeCount = 0;
    langs = languages

    constructor(
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        private libraryService: LibraryService,
        public alertController: AlertController,
        public toastController: ToastController,
        private router: Router,
        private auth: AuthService,
        private readonly tracker: MatomoTracker,
        public translate: TranslateService
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
    }

    getStyle() {
        return {
            'font-family': this.settings.font,
            'font-size': this.settings.fontSize + 'px',
            'line-height': this.settings.lineHeight
        };
    }

    settingsChanged() {
        if (this.settings.isUserOptIn) {
            this.tracker.forgetUserOptOut();
        } else {
            this.tracker.optUserOut();
        }
        this.settingsStore.updateSettings(this.settings);
    }

    async deleteData() {
        const alert = await this.alertController.create({
            header: this.translate.instant("SETTINGS_PAGE.DELETE_DATA_MODAL.INFO"),
            message: this.translate.instant("SETTINGS_PAGE.DELETE_DATA_MODAL.MESSAGE"),
            buttons: [
                {
                    text: this.translate.instant("CANCEL"),
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.translate.instant("CONFIRM"),
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
            header: this.translate.instant('SETTINGS_PAGE.SET_USER.INFO'),
            message: this.translate.instant('SETTINGS_PAGE.SET_USER.MESSAGE'),
            inputs: [
                {
                    name: 'lastname',
                    type: 'text',
                    placeholder: this.translate.instant('SETTINGS_PAGE.SET_USER.LASTNAME_PLACEHOLDER'),
                },
                {
                    name: 'firstname',
                    type: 'text',
                    placeholder: this.translate.instant('SETTINGS_PAGE.SET_USER.FIRSTNAME_PLACEHOLDER'),
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.translate.instant('CONFIRM'),
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
        if (this.devModeCount >= 10) {
            this.confirmDevMode().finally()
        }
    }

    async confirmDevMode() {
        this.resetDevModeCount();
        const alert = await this.alertController.create({
            header: this.translate.instant('SETTINGS_PAGE.DEV_MODE_MODAL.INFO'),
            message: this.translate.instant('SETTINGS_PAGE.DEV_MODE_MODAL.MESSAGE'),
            inputs: [
                {
                    name: 'password',
                    type: 'password',
                    placeholder: this.translate.instant('SETTINGS_PAGE.DEV_MODE_MODAL.PASSWORD'),
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.translate.instant('CONFIRM'),
                    handler: (data) => {
                        this.user = {firstname: data.firstname, lastname: data.lastname, username: null, email: null};
                        this.auth.setUser(this.user);

                        if (data.password === env.devModeSecret) {
                            this.settings.devMode = true;
                            this.settingsChanged();
                        } else {
                            this.presentToast(this.translate.instant('SETTINGS_PAGE.DEV_MODE_MODAL.WRONG_PASSWORD'));
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    resetDevModeCount() {
        this.devModeCount = 0;
    }
}
