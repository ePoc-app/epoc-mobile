import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {Drivers} from '@ionic/storage';
import {IonicStorageModule} from '@ionic/storage-angular';
import {PipesModule} from './pipes/pipes.module';
import {LoginComponent} from './login/login.component';
import {LoginCallbackComponent} from './login/login-callback.component';
import {AuthGuardService} from './services/auth-guard.service';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
import * as Sentry from '@sentry/angular-ivy';
import {NgxMatomoTrackerModule} from '@ngx-matomo/tracker';
import {NgxMatomoRouterModule} from '@ngx-matomo/router';
import {environment as env} from 'src/environments/environment';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


Sentry.init(
    {
        dsn: env.sentry,
        // To set your release and dist versions
        release: 'fr.inria.epoc@dev',
        dist: '1',
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        tracesSampleRate: 1.0,
        integrations: []
    }
);

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent, LoginComponent, LoginCallbackComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot({
            innerHTMLTemplatesEnabled: true
        }),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot({
            name: '__epocdb',
            driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        }),
        NgxMatomoTrackerModule.forRoot({
            disabled: !env.production,
            siteId: '133',
            trackerUrl: 'https://piwik.inria.fr/'
        }),
        NgxMatomoRouterModule,
        PipesModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
        })
    ],
    providers: [
        { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        File,
        FileTransfer,
        InAppBrowser,
        AuthGuardService,
        HTTP,
        FileOpener
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
