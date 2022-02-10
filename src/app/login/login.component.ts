import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {environment as env} from 'src/environments/environment';
import {Router} from '@angular/router';
import {AlertController, Platform, ToastController} from '@ionic/angular';
import {Browser} from '@capacitor/core';
import {AuthService} from 'src/app/services/auth.service';

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
        private ref: ChangeDetectorRef
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
            const browser = this.iab.create(oauthUrl, '_blank', {hideurlbar: 'yes', hidenavigationbuttons: 'yes', location: 'no', closebuttoncaption: 'X Fermer'});
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
                                this.toast(`Bienvenue ${user.givenName} ${user.sn}`, 'success');
                                this.ref.detectChanges();
                                this.router.navigateByUrl('/home/default');
                            });
                        }, (err) => {
                            this.toast('Problème de récupération du profil');
                        });
                    } else {
                        this.toast('Problème d’authentification');
                    }
                    browser.close();
                }
            });
        }
    }

    async externalLogin() {
        const alert = await this.alertController.create({
                header: 'Authentification',
                inputs: [
                    {
                        name: 'email',
                        placeholder: 'nom@email.com',
                    },
                    {
                        name: 'password',
                        type: 'password',
                        placeholder: '********'
                    }
                ],
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Ok',
                        handler: (form) => {
                            if (form.email !== 'apple@apple.com' ||  form.password !== 'D5QdHMJfhkP$$a4+') {
                                this.toast('Email ou mot de passe incorrect');
                                return;
                            }
                            this.auth.setUser({
                                username: 'apple',
                                firstname: 'Apple',
                                lastname: 'Apple',
                                email: 'apple@apple.com'
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
