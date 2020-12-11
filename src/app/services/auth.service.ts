import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
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
}
