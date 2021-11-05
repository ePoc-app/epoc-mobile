import {Injectable} from '@angular/core';
import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {Zip} from 'capacitor-zip';
import {from, Observable, Observer, of, Subject, timer} from 'rxjs';

const {Filesystem} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class FileService {
    zip: Zip;
    epocList = [];
    progress = 0;

    constructor(
        private file: File,
        private transfer: FileTransfer
    ) {}

    readdir(): Observable<string[]> {
        return from(new Promise<string[]>((resolve, reject) => {
            try {
                this.file.listDir(this.file.dataDirectory, 'epocs').then((result) => {
                    console.log(result);
                    resolve(result.map(item => item.name.split('.zip')[0]));
                }).catch(error => {
                    resolve([])
                })
            } catch (error) {
                resolve([])
            }
        }))
    }

    download(url, filename): Observable<number> {
        return new Observable((observer: Observer<number>) => {
            const fileTransfer: FileTransferObject = this.transfer.create();
            fileTransfer.download(url, this.file.dataDirectory + `epocs/${filename}`).then((entry) => {
                observer.complete();
            }, (error) => {
                console.log(error);
            });
            fileTransfer.onProgress((e) => {
                observer.next(Math.round(e.loaded/e.total * 100))
            })
        });
    }

    delete(filename) {
        this.file.removeFile(this.file.dataDirectory, `epocs/${filename}`)
    }

    unzip(filename, epocId) {
        return new Promise((resolve, reject) => {
            this.file.checkDir(this.file.dataDirectory, 'epocs/'+epocId).then(() =>
                this.file.removeRecursively(this.file.dataDirectory, 'epocs/'+epocId)
            ).catch((e) =>
                console.warn('Nothing to delete')
            ).finally(() => {
                this.zip.unZip({
                    source: this.file.dataDirectory + filename,
                    destination: this.file.dataDirectory + 'epocs/'+epocId,
                }, (progress) => {
                    this.progress = progress.value / 100;
                }).then(() => {
                    Filesystem.readFile({
                        // Path to NoCloud documents on iOS to be the same as cordova file plugin
                        path: (Capacitor.isNative && Capacitor.getPlatform() === 'ios' ? '../Library/NoCloud/' : '') + 'epocs/'+ epocId +'/content.json',
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
}
