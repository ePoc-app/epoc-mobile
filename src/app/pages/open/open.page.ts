import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {File, FileEntry, FileWriter} from '@ionic-native/file/ngx';
import {Zip} from 'capacitor-zip';
import {Plugins, FilesystemDirectory, FilesystemEncoding} from '@capacitor/core';
import {ToastController} from '@ionic/angular';
import {getPromise} from '@ionic-native/core';

const {Filesystem} = Plugins;

@Component({
    selector: 'app-open',
    templateUrl: 'open.page.html',
    styleUrls: ['open.page.scss']
})
export class OpenPage {
    @ViewChild('file', {static: false}) fileRef: ElementRef;

    progress = 0;
    zip: Zip;
    zipList = [];
    message = '';
    working = false;

    constructor(
        public toastController: ToastController,
        private ref: ChangeDetectorRef,
        private elRef: ElementRef,
        private router: Router,
        private file: File
    ) {
      this.zip = new Zip();
    }

    ionViewDidEnter() {
        this.readdir();
    }

    loadingLog(message) {
        this.message = message;
        console.log(message);
        this.ref.detectChanges();
    }

    async toast(message, color?) {
        const toast = await this.toastController.create({
            message,
            color,
            position: 'top',
            duration: 2000
        });
        toast.present();
    }


    pickFile() {
        if (this.working) { return; }
        this.fileRef.nativeElement.click();
    }

    fileHandler(event) {
        this.working = true;
        const file = event.target.files[0];
        this.saveFile(file);
    }

    saveFile(file) {
        this.file.writeFile(this.file.dataDirectory, file.name, '', {replace: true}).then((fileEntry: FileEntry) => {
            this.loadingLog(`Création du fichier ${file.name}`);
            this.readdir();
            fileEntry.createWriter((fileWriter) => {
                this.loadingLog(`Copie du fichier ${file.name}`);
                this.writeFileInChunks(fileWriter, file, (progress) => {
                    this.progress = progress.written / progress.total;
                    this.ref.detectChanges();
                }).then(() => {
                    this.working = false;
                    this.openEpoc(file.name);
                });
            });
        }).catch((e) => {
            this.toast('Erreur lors de l\'écriture du fichier', 'danger');
        });
    }

    openEpoc(filename) {
        if (this.working) { return; }
        this.working = true;
        this.progress = 0;
        this.loadingLog(`Ouverture de ${filename}`);
        this.unzip(filename).then(() => {
            this.toast('Démarrage', 'success');
            this.router.navigateByUrl('/home');
        }).catch((message) => {
            this.toast(message, 'danger');
        }).finally(() => {
            this.working = false;
            this.progress = 0;
            this.ref.detectChanges();
        });
    }

    unzip(filename) {
        return new Promise((resolve, reject) => {
            this.file.checkDir(this.file.dataDirectory, 'epoc').then(() =>
                this.file.removeRecursively(this.file.dataDirectory, 'epoc')
            ).catch((e) =>
                console.log('Nothing to delete')
            ).finally(() => {
              this.zip.unZip({
                  source : this.file.dataDirectory + filename,
                  destination: this.file.dataDirectory + 'epoc',
              }, (progress) => {
                  this.progress = progress.value / 100;
                  this.ref.detectChanges();
              }).then(() => {
                this.file.checkFile(
                  this.file.dataDirectory, 'epoc/content.json'
                ).then(() => {
                    resolve();
                }).catch( () => {
                    reject('Erreur lors de l\'ouverture du content.json');
                });
              }).catch(() => reject('Erreur lors du dézipage'));
            });
        });
    }

    readdir(path?) {
        this.file.listDir(this.file.dataDirectory, path ? path : '').then((result) => {
            this.zipList = result.map(file => file.name).filter(filename => filename.split('.').pop() === 'zip');
        }).catch(() => {
            console.error('Unable to read dir');
        });
    }

    fileDelete(filename) {
        Filesystem.deleteFile({
            path: filename,
            directory: FilesystemDirectory.Data
        }).then(() => {
            this.readdir();
        }).catch(() => {
            this.toast('Erreur lors de la suppression', 'danger');
        });
    }

    private writeFileInChunks(writer: FileWriter, file: Blob, progressCb?) {
        const BLOCK_SIZE = 1024 * 1024;
        let writtenSize = 0;

        function writeNextChunk() {
            const size = Math.min(BLOCK_SIZE, file.size - writtenSize);
            const chunk = file.slice(writtenSize, writtenSize + size);
            writtenSize += size;
            writer.write(chunk);
            progressCb({
                written: writtenSize,
                total: file.size
            });
        }

        return getPromise<any>((resolve, reject) => {
            writer.onerror = reject as (event: ProgressEvent) => void;
            writer.onwrite = () => {
                if (writtenSize < file.size) {
                    writeNextChunk();
                } else {
                    resolve();
                }
            };
            writeNextChunk();
        });
    }
}
