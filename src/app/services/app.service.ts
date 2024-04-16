import {Injectable} from '@angular/core';
import {Device} from '@capacitor/device';
import {App, AppInfo} from '@capacitor/app';
import {Capacitor} from '@capacitor/core';
import {AlertController, IonicSafeString} from '@ionic/angular';
import {ScreenReader} from '@capacitor/screen-reader';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {Epoc} from 'src/app/classes/epoc';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    appInfo: AppInfo;
    screenReaderDetected: boolean;
    deviceInfo;

    constructor(public alertController: AlertController, public translate: TranslateService) {
        if (!Capacitor.isNativePlatform()) {
            this.appInfo = {
                id: 'fr.inria.epoc',
                name: 'epoc',
                version: '0.0.0',
                build: 'dev'
            };
            this.deviceInfo = {
                model: 'unknown',
                operatingSystem: 'unknown',
                osVersion: '0.0.0',
                manufacturer: 'unknown',
                webViewVersion: '0.0.0',
            };
            this.screenReaderDetected = false;
            return;
        }

        App.getInfo().then((info) => {
            this.appInfo = info;
        }).catch(() => {});


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
        }).catch(() => {});
    }

    leaveComment() {
        const platform = Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web';
        if (platform === 'ios') {
            window.open(`https://apps.apple.com/app/${this.appInfo.name}/id1596317383`, '_system', 'location=yes');
        } else {
            window.open(`https://play.google.com/store/apps/details?id=${this.appInfo.id}`, '_system', 'location=yes');
        }
    }

    async displayLicence(epoc: Epoc) {
        let message;
        if (epoc.license?.name && epoc.license?.url) {
            message = this.translate.instant('LICENSE_MODAL.MESSAGE', {
                epoc: epoc.title,
                licenseName: epoc.license.name,
                licenseUrl: epoc.license.url
            })
        } else {
            message = this.translate.instant('LICENSE_MODAL.MESSAGE', {
                epoc: epoc.title,
                licenseName: 'CC-BY 4.0',
                licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed'
            })
        }

        const alert = await this.alertController.create({
            header: this.translate.instant('LICENSE_MODAL.HEADER'),
            cssClass: 'alert-alignleft',
            message: new IonicSafeString(message),
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
