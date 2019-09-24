import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public alertController: AlertController) {}

    openFile() {
        console.log('open file');
    }

    async openLink() {
        const alert = await this.alertController.create({
            header: 'Download Epoc',
            inputs: [
                {
                    name: 'url',
                    type: 'text',
                    placeholder: 'Epoc download URL'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok', data);
                    }
                }
            ]
        });

        await alert.present();
    }
}
