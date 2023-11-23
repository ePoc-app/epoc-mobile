import { Injectable } from '@angular/core';
import { File, Entry, RemoveResult, Metadata } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Zip } from 'capacitor-zip';
import { from, Observable, Observer } from 'rxjs';
import {distinctUntilChanged, finalize} from 'rxjs/operators';

export interface ExtendedEntry extends Entry {
    metadata: Metadata
}

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

    getMetadataPromise(entry) {
        return new Promise((resolve, reject) => {
            entry.getMetadata(resolve, reject);
        });
    }


    async listDirMetadata(dir): Promise<ExtendedEntry[]> {
        return new Promise<ExtendedEntry[]>((resolve) => {
            try {
                document.addEventListener('deviceready', () => {
                    this.file.listDir(this.file.dataDirectory, dir).then((entries) => {
                        Promise.all(entries.map(entry =>
                            this.getMetadataPromise(entry).then((metadata : Metadata) => {
                                return {
                                    ...entry,
                                    metadata
                                }
                            })
                        )).then(result => resolve(result)).catch(() => []);
                    }).catch(() => []);
                })
            } catch (error) {
                resolve([])
            }
        })
    }


    readdir(dir): Observable<Entry[]> {
        return from(new Promise<Entry[]>((resolve) => {
            try {
                document.addEventListener('deviceready', () => {
                    this.file.listDir(this.file.dataDirectory, dir).then((result) => {
                        resolve(result);
                    }).catch(() => {
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
                fileTransfer.download(encodeURI(url), this.file.dataDirectory + filename, true).then(() => {
                    observer.complete();
                }, (e) => {
                    observer.error(e);
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
           async () => {
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
            this.deleteFolder(dir).pipe(finalize(() => {
                this.zip.unZip({
                    source: this.file.dataDirectory + filename,
                    destination: this.file.dataDirectory + dir,
                    overwrite: true
                }, (progress) => {
                    observer.next(progress.value);
                }).then(() => observer.complete()).catch(() => observer.error('Erreur lors du dézipage'));
            })).subscribe(() => {}, (e) => console.log(e));
        });
    }
}
