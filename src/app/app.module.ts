import {NgModule} from '@angular/core';
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
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        File,
        InAppBrowser,
        AuthGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
