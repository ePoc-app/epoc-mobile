import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    private progress = 0;

    constructor(public alertController: AlertController, private file: File, private transfer: FileTransfer) {}

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

    demoDownload() {
        const url = 'https://files.inria.fr/LearningLab_public/LivreNumerique/C026PG-Distrib.zip';
        const path = 'C026PG-Distrib.zip';

        this.downloadFile(url, path);
    }

    downloadFile(url: string, fileName: string) {
        const fileTransfer = this.transfer.create();

        this.progress = 0;

        fileTransfer.download(encodeURI(url), this.file.externalDataDirectory + fileName, true).then((entry) => {
            console.log('download completed', this.file.externalDataDirectory + fileName);
        }, (error) => {
            console.log('download failed: ', error);
        });

        fileTransfer.onProgress(this.updateProgress);
    }

    updateProgress(progress) {
        this.progress = Math.round(progress.loaded / progress.total * 100);
    }
}
