import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from 'src/app/classes/settings';
import {StorageService} from './storage.service';

import { StatusBar, Style } from '@capacitor/status-bar';

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
        devMode:false
    };

    private readonly settingsSubject = new BehaviorSubject<Settings>(null);
    readonly settings$ = this.settingsSubject.asObservable();

    constructor(private storageService: StorageService) {
        this.fetchSettingss();

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
            this.settings = settings ? JSON.parse(settings) : this.defaultSettings;
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
       let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
       console.log("getTheme");
       return theme;
    }

    loadTheme(theme) {
        const root = document.querySelector(':root');
        root.setAttribute('color-scheme', `${theme}`);
        if (theme === 'dark') {
            StatusBar.setStyle({ style: Style.Dark });
        } else {
            StatusBar.setStyle({ style: Style.Light });
        }
    }

}
