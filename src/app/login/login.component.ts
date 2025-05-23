import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
import {environment as env} from 'src/environments/environment';
import {Router} from '@angular/router';
import {AlertController, Platform, ToastController} from '@ionic/angular';
import {Browser} from '@capacitor/browser';
import {AuthService} from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {secrets} from 'src/environments/secrets'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(
        public platform: Platform,
        private iab: InAppBrowser,
        private router: Router,
        public alertController: AlertController,
        public toastController: ToastController,
        private auth: AuthService,
        private http: HTTP,
        private ref: ChangeDetectorRef,
        public translate: TranslateService
    ) {
    }

    ngOnInit() {
        const navigation = this.router.getCurrentNavigation();
        const error = navigation.extras.state ? navigation.extras.state.error : null;

        if (error) {
            this.toast(error);
        }
    }

    async toast(message, color?) {
        const toast = await this.toastController.create({
            message,
            position: 'top',
            color: color ? color : 'danger',
            duration: 2000
        });
        toast.present();
    }

    oauthLogin() {
        const oauthUrl = `${env.oauth.authorizationUrl}?client_id=${encodeURIComponent(env.oauth.clientId)}` +
            `&client_secret=${encodeURIComponent(env.oauth.clientSecret)}` +
            `&redirect_uri=${encodeURIComponent(env.oauth.redirectUri)}&scope=${encodeURIComponent(env.oauth.scope)}` +
            `&response_type=${encodeURIComponent(env.oauth.responseType)}`;

        if (!this.platform.is('capacitor')) {
            Browser.open({url: oauthUrl, windowName: '_self'});
        } else {
            let responseParams;
            const parsedResponse = {access_token: null};
            const browser = this.iab.create(oauthUrl, '_blank', {
                hideurlbar: 'yes',
                hidenavigationbuttons: 'yes',
                location: 'no',
                closebuttoncaption: 'X Fermer'
            });
            browser.on('loadstart').subscribe((evt) => {
                if ((evt.url).indexOf(env.oauth.redirectUri) === 0) {
                    responseParams = ((evt.url).split('#')[1]).split('&');
                    for (const param of responseParams) {
                        parsedResponse[param.split('=')[0]] = param.split('=')[1];
                    }
                    if (parsedResponse.access_token !== undefined && parsedResponse.access_token !== null) {
                        this.http.get(env.oauth.resourceUrl + `?access_token=${parsedResponse.access_token}`, {}, {})
                        .then((response) => {
                            const user = JSON.parse(response.data);
                            this.auth.setUser({
                                username: user.id,
                                firstname: user.givenName,
                                lastname: user.sn,
                                email: user.mail
                            }).then(() => {
                                this.toast( `${this.translate.instant('ZRR.LOGIN_PAGE.WELCOME')} ${user.givenName} ${user.sn}`, 'success');
                                this.ref.detectChanges();
                                this.router.navigateByUrl('/home/default');
                            });
                        }, (err) => {
                            this.toast(this.translate.instant('ZRR.LOGIN_PAGE.ERROR_RECUP'));
                        });
                    } else {
                        this.toast(this.translate.instant('ZRR.LOGIN_PAGE.ERROR_AUTH'));
                    }
                    browser.close();
                }
            });
        }
    }

    async externalLogin() {
        const alert = await this.alertController.create({
                header: this.translate.instant('ZRR.LOGIN_MODAL.HEADER'),
                inputs: [
                    {
                        name: 'email',
                        placeholder: this.translate.instant('ZRR.LOGIN_MODAL.EMAIL_PLACEHOLDER'),
                    },
                    {
                        name: 'password',
                        type: 'password',
                        placeholder: '********'
                    }
                ],
                buttons: [
                    {
                        text: this.translate.instant('CANCEL'),
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: this.translate.instant('OK'),
                        handler: (form) => {
                            if (form.email !== secrets.appleAccount.login ||  form.password !== secrets.appleAccount.login) {
                                this.toast(this.translate.instant('ZRR.LOGIN_MODAL.ERROR'));
                                return;
                            }
                            this.auth.setUser({
                                username: 'apple',
                                firstname: 'Apple',
                                lastname: 'Apple',
                                email: secrets.appleAccount.login
                            }).then(() => {
                                this.ref.detectChanges();
                                this.router.navigateByUrl('/home/default');
                            });
                        },
                    },
                ],
            });
        return alert.present();
    }
}
