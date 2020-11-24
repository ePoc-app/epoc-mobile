import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {AuthService} from '../services/auth.service';
import {User} from '../classes/user';

@Component({
    selector: 'login-callback',
    template: '<ion-content scrollY="false">' +
        '<div class="wrapper">' +
            '<ion-spinner color="inria-blue"></ion-spinner>' +
        '</div>' +
        '</ion-content>',
    styles: [
        '.wrapper {width:100%; height:100%; display: flex; justify-content: center; align-items: center;}',
        'ion-spinner { display: block;}'
    ]
})
export class LoginCallbackComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private auth: AuthService
    ) {
    }

    ngOnInit() {
        // The callback url is something like this 'http://localhost/callback#access_token=WFQz7Q-z6-KH0&token_type=bearer&expires_in=28800'
        const fragment = this.route.snapshot.fragment;
        const token = new URLSearchParams(fragment).get('access_token');
        const expiresIn = new URLSearchParams(fragment).get('expires_in');

        this.auth.retrieveUser(token, expiresIn).then((user) => {
            this.auth.setUser(user).then(() => {
                this.router.navigateByUrl('/home/default');
            });
        }, (error) => {
            this.router.navigateByUrl('/login', { state: {error} });
        });
    }

}
