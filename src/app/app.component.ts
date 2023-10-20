import {Component} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@capacitor/splash-screen'
import {LibraryService} from './services/library.service';
import {SettingsStoreService} from './services/settings-store.service'
import {MatomoTracker} from '@ngx-matomo/tracker';
import {TranslateService} from '@ngx-translate/core';
import {combineLatest} from 'rxjs';
import {StatusBar, Style} from '@capacitor/status-bar';
import {register} from 'swiper/element/bundle';

register();

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
    translate.addLangs(['fr', 'en']);
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    document.querySelector('html').setAttribute('lang', translate.currentLang);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.libraryService.library$.subscribe(data => {
        if (data && data.length) SplashScreen.hide();
      })
      this.settingsStoreService.settings$.subscribe((settings) => {
        if (!settings.isUserOptIn) {
          this.tracker.optUserOut();
        }
        this.loadTheme(settings.theme);
      })
      combineLatest([this.settingsStoreService.settings$, this.settingsStoreService.settingsFetched$]).subscribe(([settings, fetched]) => {
        if (!fetched) return;
        this.loadLang(settings.lang);
      });
    });
  }

  loadLang(lang: string) {
    this.translate.use(lang);
    document.querySelector('html').setAttribute('lang', lang);
  }

getTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

loadTheme(theme: string) {
    let myTheme;
    if(theme) {
        myTheme = (theme === 'auto') ? this.getTheme() : theme;
    }
    const root = document.querySelector(':root');
    root.setAttribute('color-scheme', `${myTheme}`);
    if (myTheme === 'dark') {
        if(this.platform.is('ios')) {
            StatusBar.setStyle({ style: Style.Dark }).catch(()=>{});
        }
    } else {
        if(this.platform.is('ios')) {
            StatusBar.setStyle({ style: Style.Light }).catch(()=>{});
        }
    }
}
}
