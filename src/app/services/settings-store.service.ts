import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from 'src/app/classes/settings';
import {StorageService} from './storage.service';

import {StatusBar, Style} from '@capacitor/status-bar';

@Injectable({
    providedIn: 'root'
})
export class SettingsStoreService {

    defaultSettings: Settings = {
        debug:false,
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.5,
        darkMode: false,
        libraryMode: 'libraryUrl',
        devMode:false,
        isUserOptIn: true
    };

    private readonly settingsSubject = new BehaviorSubject<Settings>(this.defaultSettings);
    readonly settings$ = this.settingsSubject.asObservable();

    constructor(private storageService: StorageService) {
        this.fetchSettingss();
        this.loadTheme(this.getTheme());
    }

    get settings(): Settings {
        return this.settingsSubject.getValue();
    }

    set settings(val: Settings) {
        this.settingsSubject.next(val);
    }

    fetchSettingss() {
        this.loadTheme(this.getTheme());
        this.storageService.getValue('settings').then( (settings) => {
            this.settings = settings ? {...this.defaultSettings, ...JSON.parse(settings)} : this.defaultSettings;
            this.loadTheme(this.settings.darkMode ? 'dark' : 'light');
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
        this.loadTheme(this.settings.darkMode ? 'dark' : 'light');
        this.saveSettingss();
    }

    getTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    loadTheme(theme) {
        const root = document.querySelector(':root');
        root.setAttribute('color-scheme', `${theme}`);
        if (theme === 'dark') {
            StatusBar.setStyle({ style: Style.Dark }).catch(()=>{});
        } else {
            StatusBar.setStyle({ style: Style.Light }).catch(()=>{});
        }
    }

}
