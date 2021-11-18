import {ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {File, FileEntry, FileWriter} from '@ionic-native/file/ngx';
import {Zip} from 'capacitor-zip';
import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
import {ToastController} from '@ionic/angular';
import {getPromise} from '@ionic-native/core';
import {EpocService} from '../../services/epoc.service';

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
        private ngZone: NgZone,
        public toastController: ToastController,
        private ref: ChangeDetectorRef,
        private elRef: ElementRef,
        private router: Router,
        private file: File,
        public epocService: EpocService
    ) {
        this.zip = new Zip();
    }

    ionViewDidEnter() {
        this.readdir();
    }

    loadingLog(message) {
        this.message = message;
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
        if (this.working) {
            return;
        }
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

    openDefault(){
        this.epocService.setRootFolder(null);
        this.router.navigateByUrl('/home/default');
    }

    openEpoc(filename) {
        if (this.working) {
            return;
        }
        this.working = true;
        this.progress = 0;
        this.loadingLog(`Ouverture de ${filename}`);
        this.epocService.setRootFolder(this.file.dataDirectory + 'epoc/');
        this.unzip(filename).then((epocId) => {
            this.toast('Démarrage', 'success');
            this.ngZone.run(() => {
                this.router.navigateByUrl('/home/' + epocId);
            })
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
                console.warn('Nothing to delete')
            ).finally(() => {
                this.zip.unZip({
                    source: this.file.dataDirectory + filename,
                    destination: this.file.dataDirectory + 'epoc',
                }, (progress) => {
                    this.progress = progress.value / 100;
                    this.ref.detectChanges();
                }).then(() => {
                    Filesystem.readFile({
                        // Path to NoCloud documents on iOS to be the same as cordova file plugin
                        path: (Capacitor.isNative && Capacitor.getPlatform() === 'ios' ? '../Library/NoCloud/' : '') + 'epoc/content.json',
                        directory: FilesystemDirectory.Data,
                        encoding: FilesystemEncoding.UTF8
                    }).then((result) => {
                        const epoc = JSON.parse(result.data);
                        resolve(epoc.id);
                    }).catch(() => {
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
            console.warn('Unable to read dir');
        });
    }

    fileDelete(filename) {
        Filesystem.deleteFile({
            // Path to NoCloud documents on iOS to be the same as cordova file plugin
            path: Capacitor.isNative && Capacitor.getPlatform() === 'ios' ? '../Library/NoCloud/' + filename : filename,
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
