import {ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {File, FileEntry, FileWriter} from '@ionic-native/file/ngx';
import {Zip} from 'capacitor-zip';
import {Capacitor} from '@capacitor/core';
import { Filesystem,Directory, Encoding } from '@capacitor/filesystem';
import {ToastController} from '@ionic/angular';
import {getPromise} from '@ionic-native/core';
import { TranslateService } from '@ngx-translate/core';


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
    epocList = [];
    message = '';
    working = false;

    constructor(
        private ngZone: NgZone,
        public toastController: ToastController,
        private ref: ChangeDetectorRef,
        private elRef: ElementRef,
        private router: Router,
        private file: File,
        public translate: TranslateService
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
        this.file.writeFile(this.file.dataDirectory, `zips/${file.name}`, '', {replace: true}).then((fileEntry: FileEntry) => {
            this.loadingLog(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.CREATING', {filename: file.name}));
            this.readdir();
            fileEntry.createWriter((fileWriter) => {
                this.loadingLog(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.COPYING', {filename: file.name}));
                this.writeFileInChunks(fileWriter, file, (progress) => {
                    this.progress = progress.written / progress.total;
                    this.ref.detectChanges();
                }).then(() => {
                    this.working = false;
                    this.openEpoc(file.name);
                });
            });
        }).catch((e) => {
            this.toast(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.ERROR'), 'danger');
        });
    }

    openEpoc(filename) {
        if (this.working) {
            return;
        }
        this.working = true;
        this.progress = 0;
        this.loadingLog(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.OPENING', {filename}));
        this.unzip(filename).then((epocId) => {
            this.toast(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.STARTING'), 'success');
            this.ngZone.run(() => {
                this.router.navigateByUrl('/epoc/play/' + epocId);
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
            const tmpId = Math.random().toString(36).substr(2, 9);
            const tmpPath = 'epocs/' + tmpId;
            this.zip.unZip({
                source: this.file.dataDirectory + 'zips/' + filename,
                destination: this.file.dataDirectory +  tmpPath,
            }, (progress) => {
                this.progress = progress.value / 100;
                this.ref.detectChanges();
            }).then(() => {
                Filesystem.readFile({
                    // Path to NoCloud documents on iOS to be the same as cordova file plugin
                    path: (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? '../Library/NoCloud/' : '') + `epocs/${tmpId}/content.json`,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8
                }).then(async (result) => {
                    const epoc = JSON.parse(result.data);
                    const destPath = `epocs/${epoc.id}`;
                    await this.dirDelete(epoc.id);
                    await this.file.moveDir(this.file.dataDirectory, tmpPath, this.file.dataDirectory, destPath)
                    resolve(epoc.id);
                }).catch(() => {
                    reject(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.ERROR_OPEN'));
                });
            }).catch(() => reject(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.ERROR_ZIP')));
        });
    }

    async readdir() {
        try{
            // create zips directory if not exists
            await this.file.createDir(this.file.dataDirectory, 'zips', false);
        } catch {}
        this.zipList = (await this.file.listDir(this.file.dataDirectory, 'zips'))
            .filter(file => file.name.split('.').pop() === 'zip')
            .map(file => file.name);
        this.epocList = (await this.file.listDir(this.file.dataDirectory, 'epocs'))
            .filter(file => file.isDirectory)
            .map(file => file.name);
    }

    fileDelete(filename) {
        Filesystem.deleteFile({
            // Path to NoCloud documents on iOS to be the same as cordova file plugin
            path: (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? '../Library/NoCloud/' : '') + `zips/${filename}`,
            directory: Directory.Data
        }).then(() => {
            this.readdir();
        }).catch(() => {
            this.toast(this.translate.instant('SETTINGS_PAGE.OPEN_PAGE.FILE.ERROR_DELETE'), 'danger');
        });
    }

    async dirDelete(path) {
        try {
            await Filesystem.rmdir({
                // Path to NoCloud documents on iOS to be the same as cordova file plugin
                path: (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? '../Library/NoCloud/' : '') + `epocs/${path}`,
                directory: Directory.Data,
                recursive: true
            });
            this.readdir();
        } catch {
        }
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
