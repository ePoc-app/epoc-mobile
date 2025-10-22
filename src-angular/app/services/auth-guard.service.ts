import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {
    }

    canActivate(): Observable<boolean> {
        return this.auth.isAuthenticated().pipe(
            map(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/login']);
                }
                return authenticated;
            }),
            first()
        );
    }
}
