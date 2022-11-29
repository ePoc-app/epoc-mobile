import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen'
import {LibraryService} from './services/library.service';
import { SettingsStoreService } from './services/settings-store.service'
import {MatomoTracker} from '@ngx-matomo/tracker';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public libraryService: LibraryService,
    public settingsStoreService: SettingsStoreService,
    private readonly tracker: MatomoTracker,
    public translate: TranslateService
  ) {
    this.initializeApp();
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('fr');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.libraryService.library$.subscribe(data => {
        if (data && data.length) SplashScreen.hide();
      })
      this.settingsStoreService.settings$.subscribe(settings => {
        if (!settings.isUserOptIn) {
          this.tracker.optUserOut();
        }
      })
    });
  }
}
