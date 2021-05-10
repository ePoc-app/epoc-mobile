import { Component, Input } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'modal-page',
    templateUrl: './modal-page.component.html'
})
export class ModalPage {
    @Input() correct: boolean;
    @Input() category: string;
    @Input() answer: string;
    @Input() explanation: string;

    constructor(public modalController: ModalController) {}

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            dismissed: true
        });
    }

}
