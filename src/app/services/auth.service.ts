import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment as env} from '../../environments/environment';
import {OauthUser, User} from '../classes/user';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    isAuthenticated(): Observable<boolean> {
        return this.getUser().pipe(map((user) => {
            if (!user) {
                return false;
            }
            return true;
        }));
    }

    getUser() {
        return from(this.storageService.getValue('user')).pipe(map(user => JSON.parse(user)));
    }

    setUser(user) {
        return this.storageService.setValue('user', JSON.stringify(user));
    }

    retrieveUser(token, expiresIn) {
        const params = {
            access_token : token
        };
        return new Promise((resolve, reject) => {
            this.http.get(env.oauth.resourceUrl, {params}).subscribe(
                (data: OauthUser) => {
                    const user: User = {
                        username: data.id,
                        firstname: data.givenName,
                        lastname: data.sn,
                        email: data.mail,
                        authenticationToken: token,
                        authenticationDate: +data.authenticationDate,
                        authenticationExpires: +expiresIn
                    };
                    resolve(user);
                },
                err => {
                    reject('Erreur d\`authentification');
                }
            );
        });
    }
}
