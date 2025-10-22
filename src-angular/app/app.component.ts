import {Component, NgZone} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {SplashScreen} from '@capacitor/splash-screen'
import {LibraryService} from './services/library.service';
import {SettingsStoreService} from './services/settings-store.service'
import {MatomoTracker} from '@ngx-matomo/tracker';
import {TranslateService} from '@ngx-translate/core';
import {combineLatest} from 'rxjs';
import {StatusBar, Style} from '@capacitor/status-bar';
import {register, SwiperContainer} from 'swiper/element/bundle';
import {App, URLOpenListenerEvent} from '@capacitor/app';
import {Router} from '@angular/router';
import {LocalEpocsService} from 'src/app/services/localEpocs.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private zone: NgZone,
    public libraryService: LibraryService,
    public localEpocsService: LocalEpocsService,
    public settingsStoreService: SettingsStoreService,
    private readonly tracker: MatomoTracker,
    private alertController: AlertController,
    public translate: TranslateService
  ) {
    this.initializeApp();
    translate.addLangs(['fr', 'en', 'it']);
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    document.querySelector('html').setAttribute('lang', translate.currentLang);



    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.anchorNode) {
            document.querySelectorAll('swiper-container').forEach(swiperContainer => {
                swiperContainer.swiper.allowTouchMove = false;
            });
        }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.libraryService.officialCollections$.subscribe(data => {
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
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
          const urlOpen = new URL(event.url);
          const slug = urlOpen.pathname.replace('/app-redirect', '');
          if (slug === '/dl') {
              // Example url: https://epoc.inria.fr/app-redirect/dl?url=https://example.com/epoc.zip
              // Ask to download the linked ePoc
              if (urlOpen.searchParams.has('url')) {
                  this.confirmOpen(urlOpen.searchParams.get('url'));
              }
          } else if (slug) {
              // Example url: https://epoc.inria.fr/app-redirect/settings
              // Redirect to /settings
              this.router.navigateByUrl(slug);
          }
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

    async confirmOpen(url) {
        const alert = await this.alertController.create({
            header: 'Confirmation',
            subHeader: `Importation de l'ePoc ${url}`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Confirmer',
                    role: 'confirm',
                    handler: () => {
                        this.localEpocsService.downloadLocalEpoc(url);
                        this.router.navigateByUrl('/library');
                    },
                },
            ],
        });

        await alert.present();
    }

    resetSelection() {
        window.getSelection().removeAllRanges();
        setTimeout(() => {
            (document.querySelectorAll('.reader swiper-container') as NodeListOf<SwiperContainer>).forEach(swiperContainer => {
                swiperContainer.swiper.allowTouchMove = true;
            });
        }, 50);
    }
}
