import {Injectable} from '@angular/core';
import {Device} from '@capacitor/device';
import {App, AppInfo} from '@capacitor/app';
import {Capacitor} from '@capacitor/core';
import {AlertController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    appInfo: AppInfo;
    deviceInfo;

    constructor(public alertController: AlertController) {
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
            header: 'Laisser un commentaire',
            message: `Sur quel service souhaitez-vous laisser un commentaire ?`,
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
            header: 'Licence',
            cssClass: 'alert-alignleft',
            message: `<strong>Conditions d’utilisation des contenus de l\'ePoc :</strong><br/>
                      Les ressources de l'ePoc sont, sauf mention contraire, diffusées sous Licence <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" title="Lien licence Creative Commons">Creative Commons CC-BY 4.0</a> :<br/>
                      Attribution. Le titulaire des droits autorise toute exploitation de l’œuvre, y compris à des fins commerciales, ainsi que la création d’œuvres dérivées, dont la distribution est également autorisée sans restriction, à condition de l’attribuer à son auteur en citant son nom.<br/><br/>
                      Si vous utilisez des contenus de l'ePoc, voici la mention à ajouter pour l'attribution selon l'utilisation :<br/>
                      Crédit : <strong>"${epoc.title}"</strong>, ePoc Inria, publié sous licence CC-BY dans l'application <a href="https://epoc.inria.fr/" title="Lien vers site ePoc">https://epoc.inria.fr/</a>`,
            buttons: ['OK'],
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
