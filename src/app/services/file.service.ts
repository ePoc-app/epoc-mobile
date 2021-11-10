import {Injectable} from '@angular/core';
import {File, Entry, RemoveResult} from '@ionic-native/file/ngx';
import {FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {Zip} from 'capacitor-zip';
import {from, Observable, Observer} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FileService{
    zip: Zip;

    constructor(
        private file: File,
        private transfer: FileTransfer
    ) {}

    readdir(dir): Observable<Entry[]> {
        return from(new Promise<Entry[]>((resolve, reject) => {
            try {
                this.file.listDir(this.file.dataDirectory, dir).then((result) => {
                    resolve(result);
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
            fileTransfer.download(url, this.file.dataDirectory + filename).then((entry) => {
                observer.complete();
            }, (error) => {
                console.log(error);
            });
            fileTransfer.onProgress((e) => {
                observer.next(Math.round(e.loaded/e.total * 100))
            })
        }).pipe(distinctUntilChanged());
    }

    delete(filename): Observable<RemoveResult> {
        return from(this.file.removeFile(this.file.dataDirectory, filename));
    }

    unzip(filename, dir): Observable<number> {
        return new Observable((observer: Observer<number>) => {
            this.file.checkDir(this.file.dataDirectory, dir).then(() =>
                this.file.removeRecursively(this.file.dataDirectory, dir)
            ).catch((e) =>
                console.warn('Nothing to delete')
            ).finally(() => {
                this.zip.unZip({
                    source: this.file.dataDirectory + filename,
                    destination: this.file.dataDirectory + dir,
                }, (progress) => {
                    observer.next(progress.value);
                }).then(() => observer.complete()).catch(() => observer.error('Erreur lors du dézipage'));
            });
        });
    }
}
