// src/composables/useStorage.ts
import { ref, onMounted } from 'vue';
import { Drivers, Storage } from '@ionic/storage';

let storageInstance: Storage | null = null;

export function useStorage() {
    const isReady = ref(false);

    async function init() {
        if (storageInstance !== null) {
            isReady.value = true;
            return;
        }
        const storage = new Storage({
            name: '__epocdb',
            // todo : CordovaSQLiteDriver removed ? => check if the mobile apps are using it first
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
        });
        storageInstance = await storage.create();
        isReady.value = true;
    }

    async function setValue(key: string, value: any): Promise<void> {
        if (!isReady.value) await init();
        await storageInstance?.set(key, value);
    }

    async function getValue(key: string): Promise<string | null> {
        if (!isReady.value) await init();
        return storageInstance?.get(key);
    }

    return {
        setValue,
        getValue,
        isReady,
    };
}
