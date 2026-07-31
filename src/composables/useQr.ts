import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { alertController } from '@ionic/vue';
import { i18n } from '@/i18n';
import { useLibraryStore } from '@/stores/libraryStore';
import { useLocalEpocsStore } from '@/stores/localEpocsStore';

export async function confirmOpen(url: string, onCancel?: () => void) {
    const libraryStore = useLibraryStore();
    const localEpocsStore = useLocalEpocsStore();

    const alert = await alertController.create({
        header: i18n.global.t('CONFIRM'),
        subHeader: `${i18n.global.t('LIBRARY_PAGE.IMPORT')} ${url} ?`,
        buttons: [
            {
                text: i18n.global.t('CANCEL'),
                role: 'cancel',
                handler: () => onCancel?.(),
            },
            {
                text: i18n.global.t('CONFIRM'),
                role: 'confirm',
                handler: () => {
                    if (url.endsWith('.json')) libraryStore.addCustomCollection(url);
                    else localEpocsStore.downloadLocalEpoc(url);
                },
            },
        ],
    });

    await alert.present();
}

export function useQr() {
    async function startScan() {
        try {
            const result = await CapacitorBarcodeScanner.scanBarcode({
                hint: 0,
            });

            if (result.ScanResult) {
                await confirmOpen(result.ScanResult, startScan);
            }
        } catch (e) {
            console.error('Error while scanning the QRCode', e);
        }
    }

    return {
        startScan,
    };
}
