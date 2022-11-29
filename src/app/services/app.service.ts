import {Injectable} from '@angular/core';
import {Device} from '@capacitor/device';
import {App, AppInfo} from '@capacitor/app';
import {Capacitor} from '@capacitor/core';
import {AlertController} from '@ionic/angular';
import {ScreenReader} from '@capacitor/screen-reader';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    appInfo: AppInfo;
    screenReaderDetected: boolean;
    deviceInfo;

    constructor(public alertController: AlertController, public translate: TranslateService) {
        App.getInfo().then((info) => {
            this.appInfo = info;
        }).catch(() => {
            this.appInfo = {
                id: 'fr.inria.epoc',
                name: 'epoc',
                version: '0.0.0',
                build: 'dev'
            }
        });

        
        from(ScreenReader.isEnabled()).subscribe(screenReaderDetected => {
            this.screenReaderDetected = screenReaderDetected.value;
        });

        Device.getInfo().then((info) => {
            this.deviceInfo = {
                model: info.model,
                operatingSystem: info.operatingSystem,
                osVersion: info.osVersion,
                manufacturer: info.manufacturer,
                webViewVersion: info.webViewVersion
            }
        }).catch(() => {
            this.deviceInfo = {
                model: 'unknown',
                operatingSystem: 'unknown',
                osVersion: '0.0.0',
                manufacturer: 'unknown',
                webViewVersion: '0.0.0',
            }
        });
    }

    async leaveComment(epoc) {
        const platform = Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web';
        const infos = `${this.joinObject(this.deviceInfo)}${this.joinObject(this.appInfo)}ePoc=${epoc.id}`;
        const alert = await this.alertController.create({
            header: this.translate.instant('COMMENT_MODAL.HEADER'),
            message: this.translate.instant('COMMENT_MODAL.MESSAGE'),
            buttons: [
                {
                    text: platform === 'ios' ? 'App Store' : 'Play Store',
                    handler: () => {
                        if (platform === 'ios') {
                            window.open(`https://apps.apple.com/app/${this.appInfo.name}/id1596317383`, '_system', 'location=yes');
                        } else {
                            window.open(`https://play.google.com/store/apps/details?id=${this.appInfo.id}`, '_system', 'location=yes');
                        }
                    }
                }, {
                    text: 'Sondage',
                    handler: () => {
                        window.open(`https://epoc.inria.fr/sondage-redirect?appdata=${infos}`, '_system', 'location=yes');
                    }
                }
            ]
        });

        await alert.present();
    }

    async displayLicence(epoc) {
        const alert = await this.alertController.create({
            header: this.translate.instant('LICENSE_MODAL.HEADER'),
            cssClass: 'alert-alignleft',
            message: this.translate.instant('LICENSE_MODAL.MESSAGE', {epoc: epoc.title }),
            buttons: [this.translate.instant('OK')],
        });

        await alert.present();
    }


    joinObject(object: any): string {
        if (typeof object !== 'object') return '';
        return Object.entries(object).reduce((prevVal, entry) => {
            return `${prevVal}${entry.join('=')},`
        }, '');
    }


}
