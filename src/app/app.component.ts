import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen'
import {LibraryService} from './services/library.service';
import { SettingsStoreService } from './services/settings-store.service'


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public libraryService: LibraryService,
    public settingsStoreService: SettingsStoreService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.libraryService.library$.subscribe(data => {
        if (data && data.length) SplashScreen.hide();
      })
    });
  }
}
