import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HttpClientModule} from '@angular/common/http';

import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {PipesModule} from './pipes/pipes.module';
import {LoginComponent} from './login/login.component';
import {LoginCallbackComponent} from './login/login-callback.component';
import {AuthGuardService} from './services/auth-guard.service';
import {File} from '@ionic-native/file/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import * as Sentry from '@sentry/angular';
import {Integrations as TracingIntegrations} from '@sentry/tracing';

Sentry.init(
    {
        dsn: 'https://2992d74734b44e5cbc12b4926bdcd7be@o1092720.ingest.sentry.io/6111359',
        // To set your release and dist versions
        release: 'fr.inria.epoc@dev',
        dist: '1',
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        tracesSampleRate: 1.0,
        integrations: [
            new TracingIntegrations.BrowserTracing({
                tracingOrigins: ['localhost'],
                routingInstrumentation: Sentry.routingInstrumentation,
            }),
        ]
    }
);

@NgModule({
    declarations: [AppComponent, LoginComponent, LoginCallbackComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        PipesModule
    ],
    providers: [
        {provide: ErrorHandler, useValue: Sentry.createErrorHandler()},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
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
