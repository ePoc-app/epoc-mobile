import {ChangeDetectorRef, Component} from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    private library = [];

    constructor(
        public alertController: AlertController,
        public toastController: ToastController,
        private cdr: ChangeDetectorRef,
        private file: File,
        private transfer: FileTransfer
    ) {
        const fileList = file.listDir(file.externalDataDirectory, '');

        if (fileList) {
            fileList.then((entries) => {
                const mappedEntries = entries.map(entry => {
                    return {
                        name: entry.name.replace('.zip', ''),
                        filename: entry.name,
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        progress: 100
                    };
                });
                this.library.push(...mappedEntries);
            });
        }
    }

    async openFile() {
        const toast = await this.toastController.create({
            message: 'Feature not available yet.',
            duration: 2000
        });
        toast.present();
    }

    async openLink() {
        const toast = await this.toastController.create({
            message: 'Feature not available yet.',
            duration: 2000
        });
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
                       toast.present();
                    }
                }
            ]
        });

        await alert.present();
    }

    async demoDownload() {
        const url = 'https://files.inria.fr/LearningLab_public/LivreNumerique/C026PG-Distrib.zip';
        const filename = 'C026PG-Distrib.zip';
        const toast = await this.toastController.create({
            message: 'This Epoc already exists.',
            duration: 2000
        });

        try {
            await this.file.checkFile(this.file.externalDataDirectory, filename);
            toast.present();
        } catch (error) {
            this.downloadFile(url, filename);
        }
    }

    downloadFile(url: string, fileName: string) {
        const fileTransfer = this.transfer.create();

        const newItem = {
            name: fileName.replace('.zip', ''),
            filename: fileName,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            progress: 0,
        };

        this.library.push(newItem);

        fileTransfer.download(encodeURI(url), this.file.externalDataDirectory + fileName, true).then((entry) => {
            console.log('download completed', this.file.externalDataDirectory + fileName);
        }, (error) => {
            console.log('download failed: ', error);
        });

        const component = this;

        fileTransfer.onProgress((progress) => {
            newItem.progress = Math.round(progress.loaded / progress.total * 100);
            component.cdr.detectChanges();
        });
    }

    onDeleteItem(index) {
        this.library.splice(index, 1);
    }
}
