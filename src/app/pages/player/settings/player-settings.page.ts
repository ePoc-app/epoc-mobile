import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-player-settings',
    templateUrl: 'player-settings.page.html',
    styleUrls: ['player-settings.page.scss']
})
export class PlayerSettingsPage {

    settings = {
        font: 'sans',
        fontSize: 16,
        lineHeight: 1.4,
        darkMode: false
    };

    constructor() {}

    getStyle() {
        console.log(this.settings.fontSize);
        return {
            'font-family': this.settings.font,
            'font-size': this.settings.fontSize + 'px',
            'line-height': this.settings.lineHeight
        };
    }
}
