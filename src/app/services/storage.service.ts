import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage: Storage | null = null;

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        if(this._storage != null) {
            return;
        }
        await this.storage.defineDriver(CordovaSQLiteDriver);
        this._storage = await this.storage.create();
    }

    public setValue(key: string, value: any): Promise<any> {
        return this.init().then(() => {
            return this._storage?.set(key, value);
        });
    }

    public getValue(key: string): Promise<string> {
        return this.init().then(() => {
            return this._storage?.get(key)
        })
    }
}
