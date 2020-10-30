import {Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {environment as env} from '../../environments/environment';
import {Router} from '@angular/router';
import {Platform, ToastController} from '@ionic/angular';
import {Browser} from '@capacitor/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    userForm = {
        login: '',
        password: ''
    };
    activeTab = 'inria';

    constructor(public platform: Platform, private iab: InAppBrowser, private router: Router, public toastController: ToastController) {
    }

    ngOnInit() {
        const navigation = this.router.getCurrentNavigation();
        const error = navigation.extras.state ? navigation.extras.state.error : null;

        if (error) {
            this.errorToast(error);
        }
    }

    async errorToast(message) {
        const toast = await this.toastController.create({
            message,
            position: 'top',
            color: 'danger',
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
            const browser = this.iab.create(oauthUrl, '_self',{hideurlbar: 'yes', hidenavigationbuttons: 'yes'});
            browser.on('loadstart').subscribe((evt) => {
                if ((evt.url).indexOf(env.oauth.redirectUri) === 0) {
                    responseParams = ((evt.url).split('#')[1]).split('&');
                    for (const param of responseParams) {
                        parsedResponse[responseParams[param].split('=')[0]] = responseParams[param].split('=')[1];
                    }
                    if (parsedResponse.access_token !== undefined &&
                        parsedResponse.access_token !== null) {
                        console.log(parsedResponse);
                    } else {
                        this.errorToast('Problème d’authentification');
                    }
                    browser.close();
                }
            });

            browser.on('exit').subscribe((evt) => {
                this.errorToast('Une erreur est survenue lors de la tentative de connexion');
            });
        }
    }

    firebaseLogin(event) {
        event.preventDefault();
        console.log(this.userForm);
        // @TODO
    }

    changeLoginTab(event) {
        this.activeTab = event.detail.value;
    }

    updateUserForm(key: string, event) {
        this.userForm[key] = event.target.value;
    }
}
