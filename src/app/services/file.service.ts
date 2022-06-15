import { Injectable } from '@angular/core';
import { File, Entry, RemoveResult, DirectoryEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Zip } from 'capacitor-zip';
import { from, Observable, Observer } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    zip: Zip;

    constructor(
        private file: File,
        private transfer: FileTransfer
    ) {
        this.zip = new Zip();
    }

    readdir(dir): Observable<Entry[]> {
        return from(new Promise<Entry[]>((resolve, reject) => {
            try {
                document.addEventListener('deviceready', () => {
                    this.file.listDir(this.file.dataDirectory, dir).then((result) => {
                        resolve(result);
                    }).catch(error => {
                        resolve([])
                    })
                })
            } catch (error) {
                resolve([])
            }
        }))
    }


    download(url : string, filename : string): Observable<number> {
        return new Observable((observer: Observer<number>) => {
            this.createFolderIfNotExist('epocs').then(() => {
                const fileTransfer: FileTransferObject = this.transfer.create();
                fileTransfer.download(encodeURI(url), this.file.dataDirectory + filename).then((entry) => {
                    observer.complete();
                }, (error) => {
                    console.warn(error);
                });
                fileTransfer.onProgress((e) => {
                    observer.next(Math.round(e.loaded / e.total * 100))
                })
            })
        }).pipe(distinctUntilChanged());
    }

    deleteZip(filename: string): Observable<RemoveResult> {
        return from(this.file.removeFile(this.file.dataDirectory, filename));
    }

    createFolderIfNotExist(dir: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.file.checkDir(this.file.dataDirectory, dir).then(() => {
                resolve(false);
            },
           async (error) => {
              await this.file.createDir(this.file.dataDirectory, dir, false);
              resolve(true);
            });
        });
    }

    deleteFolder(dir): Observable<RemoveResult> {
        return from(this.file.removeRecursively(this.file.dataDirectory, dir));
    }

    unzip(filename, dir): Observable<number> {
        return new Observable((observer: Observer<number>) => {
            this.file.checkDir(this.file.dataDirectory, dir).then(() =>
                this.deleteFolder(dir)
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
