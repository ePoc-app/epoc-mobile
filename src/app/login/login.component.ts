import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {environment as env} from '../../environments/environment';
import {Router} from '@angular/router';
import {Platform, ToastController} from '@ionic/angular';
import {Browser} from '@capacitor/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../services/auth.service';

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

    constructor(
        public platform: Platform,
        private iab: InAppBrowser,
        private router: Router,
        public toastController: ToastController,
        public fireAuth: AngularFireAuth,
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
            const browser = this.iab.create(oauthUrl, '_blank', {hideurlbar: 'yes', hidenavigationbuttons: 'yes'});
            browser.on('loadstart').subscribe((evt) => {
                if ((evt.url).indexOf(env.oauth.redirectUri) === 0) {
                    console.log(evt.url)
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

    firebaseLogin(event) {
        event.preventDefault();
        this.fireAuth.signInWithEmailAndPassword(this.userForm.login, this.userForm.password)
        .then(result => {
            this.auth.setUser({
                username: 'admin',
                firstname: 'Admin',
                lastname: 'User',
                email: this.userForm.login,
            }).then(() => {
                this.router.navigateByUrl('/home/default');
            });
        })
        .catch(error => {
            this.toast(error.message);
        });
    }

    changeLoginTab(event) {
        this.activeTab = event.detail.value;
    }

    updateUserForm(key: string, event) {
        this.userForm[key] = event.target.value;
    }
}
