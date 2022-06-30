import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from 'src/app/classes/settings';
import {StorageService} from './storage.service';

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
        this.storageService.getValue('settings').then( (settings) => {
            this.settings = settings ? JSON.parse(settings) : this.defaultSettings;
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
