import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private storage: Storage) {}

    public setValue(key: string, value: string): Promise<boolean> {
        return this.storage.ready().then(() => {
            return this.storage.set(key, value).catch(() => {
                return null;
            });
        });
    }

    public getValue(key: string): Promise<string> {
        return this.storage.ready().then(() => {
            return this.storage.get(key).catch(() => {
                return null;
            });
        });
    }
}
