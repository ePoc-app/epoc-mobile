import {Component} from '@angular/core';
import {SettingsStoreService} from '../../../services/settings-store.service';
import {Settings} from '../../../classes/settings';

@Component({
    selector: 'app-player-settings',
    templateUrl: 'player-settings.page.html',
    styleUrls: ['player-settings.page.scss']
})
export class PlayerSettingsPage {

    settings: Settings = {
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.4,
        darkMode: false
    };

    constructor(
        private settingsStore: SettingsStoreService
    ) {

        this.settingsStore.settings$.subscribe(settings => {
            if (settings) {
                this.settings = settings;
            }
        });
    }

    getStyle() {
        return {
            'font-family': this.settings.font,
            'font-size': this.settings.fontSize + 'px',
            'line-height': this.settings.lineHeight
        };
    }

    settingsChanged() {
        this.settingsStore.updateSettings(this.settings);
    }
}
