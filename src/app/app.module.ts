import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
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
import {AuthGuardService} from './services/auth-guard.service';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
import {FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
import {NgxMatomoTrackerModule} from '@ngx-matomo/tracker';
import {NgxMatomoRouterModule} from '@ngx-matomo/router';
import {environment as env} from 'src/environments/environment';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = {
        press: { time: 1000 }
    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
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
        }),
        HammerModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
        File,
        FileTransfer,
        InAppBrowser,
        AuthGuardService,
        HTTP
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
