import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from 'src/app/classes/settings';
import {StorageService} from './storage.service';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {languages} from 'src/environments/languages';

@Injectable({
    providedIn: 'root'
})
export class SettingsStoreService {

    defaultSettings: Settings = {
        debug:false,
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.5,
        lang: languages.has(navigator.language.substring(0,2)) ? navigator.language.substring(0,2) : 'en',
        theme: 'light',
        customLibrairies: [],
        devMode:false,
        isUserOptIn: true
    };

    private readonly settingsSubject = new BehaviorSubject<Settings>(this.defaultSettings);
    readonly settings$ = this.settingsSubject.asObservable();

    private readonly settingsFetched = new BehaviorSubject<boolean>(false);
    readonly settingsFetched$ = this.settingsFetched.asObservable();

    constructor(private storageService: StorageService, public platform: Platform, public translate: TranslateService) {
        this.fetchSettingss();
    }

    get settings(): Settings {
        return this.settingsSubject.getValue();
    }

    set settings(val: Settings) {
        this.settingsSubject.next(val);
    }

    fetchSettingss() {
        this.storageService.getValue('settings').then( (settings) => {
            this.settings = settings ? {...this.defaultSettings, ...JSON.parse(settings)} : this.defaultSettings;
            this.settingsFetched.next(true)
        });
    }

    saveSettingss() {
        this.storageService.setValue('settings', JSON.stringify(this.settings));
    }

    resetSettings(){
        this.settings = this.defaultSettings;
        this.saveSettingss();
    }

    updateSettings(settings: Settings) {
        this.settings = settings;
        this.saveSettingss();
    }
}
