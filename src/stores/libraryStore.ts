import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';
import {actionSheetController, alertController, toastController} from '@ionic/vue';
import {listCircleOutline, refreshOutline, starOutline, trash, receiptOutline, cloudDownloadOutline} from 'ionicons/icons';
import {useRouter} from 'vue-router';
import {useSettingsStore} from './settingsStore';
import {useReadingStore} from './readingStore';
import type {Epoc, EpocCollection, EpocLibraryState, EpocMetadata, Publisher} from '@/types/epoc';
import type {Reading} from '@/types/reading';
import { ComposerTranslation } from 'vue-i18n';

export const useLibraryStore = defineStore('library', () => {
    // --- State ---
    const settingsStore = useSettingsStore();
    const readingStore = useReadingStore();
    const router = useRouter();

    //const officialCollectionsUrl = 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/official-collections.json';
    const officialCollectionsUrl = 'https://epoc.inria.fr/official-collections.json';

    const officialCollections = ref<Record<string, EpocCollection>>({});
    const customCollections = ref<Record<string, EpocCollection>>({});
    const epocProgresses = ref<Record<string, number>>({});
    const readings = ref<Reading[]>([]);

    // --- Getters ---
    const getOfficialCollections = computed(() => officialCollections.value);
    const getCustomCollections = computed(() => customCollections.value);
    const getEpocProgresses = computed(() => epocProgresses.value);

    // --- Actions ---
    async function fetchOfficialCollections() {
        try {
            const cachedOfficialCollections = JSON.parse(localStorage.getItem('officialCollections') || '{}');
            const response = await fetch(officialCollectionsUrl);
            if (!response.ok) throw new Error('Failed to fetch official collections');
            const collectionUrls: string[] = await response.json();
            const collections = await Promise.all(
                collectionUrls.map(async (url) => {
                    const collectionResponse = await fetch(url);
                    if (!collectionResponse.ok) throw new Error(`Failed to fetch collection: ${url}`);
                    const collection: EpocCollection = await collectionResponse.json();
                    Object.keys(collection.ePocs).forEach((id) => {
                        collection.ePocs[id] = {
                            ...collection.ePocs[id],
                            downloading: false,
                            downloaded: false,
                            unzipping: false,
                            opened: false,
                        };
                    });
                    return collection;
                })
            );
            const collectionsRecord = collections.reduce((acc, collection) => {
                acc[collection.id] = collection;
                return acc;
            }, {} as Record<string, EpocCollection>);
            localStorage.setItem('officialCollections', JSON.stringify(collectionsRecord));
            officialCollections.value = collectionsRecord;
            // Check local content for each epoc
            for (const collection of Object.values(collectionsRecord)) {
                for (const epoc of Object.values(collection.ePocs)) {
                    const localEpoc = await readEpocContent(epoc.id);
                    if (localEpoc) {
                        const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
                        const updateAvailable = new Date(epoc.lastModified) > downloadDate;
                        updateEpocCollectionState(epoc.id, { downloaded: true, updateAvailable }, collection.id);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching official collections:', error);
        }
    }

    async function fetchCustomCollections() {
        try {
            const cachedCustomCollections = JSON.parse(localStorage.getItem('customCollections') || '{}');
            if (settingsStore.settings.customLibrairies.length === 0) {
                customCollections.value = {};
                return;
            }
            const collections = await Promise.all(
                settingsStore.settings.customLibrairies.map(async (url) => {
                    const collectionResponse = await fetch(url);
                    if (!collectionResponse.ok) throw new Error(`Failed to fetch collection: ${url}`);
                    const collection: EpocCollection = await collectionResponse.json();
                    Object.keys(collection.ePocs).forEach((id) => {
                        collection.ePocs[id] = {
                            ...collection.ePocs[id],
                            downloading: false,
                            downloaded: false,
                            unzipping: false,
                            opened: false,
                        };
                    });
                    collection.url = url;
                    return collection;
                })
            );
            const collectionsRecord = collections.reduce((acc, collection) => {
                acc[collection.id] = collection;
                return acc;
            }, {} as Record<string, EpocCollection>);
            customCollections.value = collectionsRecord;
            // Check local content for each epoc
            for (const collection of Object.values(collectionsRecord)) {
                for (const epoc of Object.values(collection.ePocs)) {
                    const localEpoc = await readEpocContent(epoc.id);
                    if (localEpoc) {
                        const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
                        const updateAvailable = new Date(epoc.lastModified) > downloadDate;
                        updateEpocCollectionState(epoc.id, { downloaded: true, updateAvailable }, collection.id, true);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching custom collections:', error);
        }
    }

    async function readEpocContent(epocId: string): Promise<Epoc | null> {
        try {
            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
                const file = await Filesystem.readFile({
                    path: `../Library/NoCloud/epocs/${epocId}/content.json`,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });
                return JSON.parse(file.data);
            } else {
                const rootDirectory = Capacitor.isNativePlatform() ? Capacitor.getPlatform() === 'android' ? Filesystem.Directory.Data : 'assets/demo/' : 'assets/demo/';
                const url = Capacitor.convertFileSrc(`${rootDirectory}epocs/${epocId}/content.json`);
                const response = await fetch(url);
                if (!response.ok) return null;
                return await response.json();
            }
        } catch (error) {
            return null;
        }
    }

    function updateEpocCollectionState(
        epocId: string,
        state: EpocLibraryState,
        collectionId: string,
        custom: boolean = false
    ) {
        const collectionToUpdate = custom ? customCollections.value : officialCollections.value;
        const epoc = collectionToUpdate[collectionId]?.ePocs[epocId];
        if (!epoc) {
            console.warn(`ePoc with id ${epocId} not found in collection ${collectionId}`);
            return;
        }
        epoc.downloading = state.downloading ?? epoc.downloading;
        epoc.downloaded = state.downloaded ?? epoc.downloaded;
        epoc.unzipping = state.unzipping ?? epoc.unzipping;
        epoc.opened = state.opened ?? epoc.opened;
        epoc.updateAvailable = state.updateAvailable ?? epoc.updateAvailable;
        if (custom) {
            customCollections.value = { ...customCollections.value };
        } else {
            officialCollections.value = { ...officialCollections.value };
        }
    }

    function updateEpocProgress(epocId: string, progress: number) {
        epocProgresses.value[epocId] = progress;
    }

    async function downloadEpoc(epoc: EpocMetadata, libraryId: string) {
        updateEpocCollectionState(epoc.id, { downloading: true }, libraryId);
        updateEpocProgress(epoc.id, 0);
        // Implement your download logic here using fetch
        // Example:
        try {
            const response = await fetch(epoc.download);
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            // Save the blob to the filesystem using Capacitor or other methods
            // Update progress as needed
            // After download, call unzipEpoc
        } catch (error) {
            console.error('Download error:', error);
            updateEpocCollectionState(epoc.id, {}, libraryId);
        }
    }

    async function unzipEpoc(epocId: string, libraryId?: string) {
        updateEpocCollectionState(epocId, { unzipping: true }, libraryId);
        updateEpocProgress(epocId, 0);
        // Implement your unzip logic here
        // After unzip, update state
        updateEpocCollectionState(epocId, { downloaded: true }, libraryId);
    }

    async function deleteEpoc(epoc: EpocMetadata, libraryId?: string) {
        // Implement your delete logic here
        updateEpocCollectionState(epoc.id, {}, libraryId);
    }

    async function checkCustomCollectionUrl(url: string): Promise<string | null> {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('URL unreachable');
            const collection: EpocCollection = await response.json();
            if (!collection || !collection.id || !collection.ePocs) {
                return 'CUSTOM_COLLECTION.ERROR_INVALID';
            }
            if (customCollections.value[collection.id] || officialCollections.value[collection.id]) {
                return 'CUSTOM_COLLECTION.ERROR_DUPLICATE';
            }
            return null;
        } catch (error) {
            return 'CUSTOM_COLLECTION.ERROR_UNREACHABLE';
        }
    }

    async function epocLibraryMenu(t: ComposerTranslation, epoc: EpocMetadata, libraryId?: string) {
        const buttons = [
            {
                text: t('FLOATING_MENU.TOC'),
                icon: listCircleOutline,
                handler: () => router.push(`/epoc/toc/${epoc.id}`),
            },
            {
                text: t('FLOATING_MENU.SCORE_DETAILS'),
                icon: starOutline,
                handler: () => router.push(`/epoc/score/${epoc.id}`),
            },
            {
                text: t('FLOATING_MENU.LICENSE'),
                icon: receiptOutline,
                handler: () => {
                    // Implement your license display logic
                },
            },
            ...(epoc.updateAvailable
                ? [
                    {
                        text: t('FLOATING_MENU.UPDATE'),
                        icon: cloudDownloadOutline,
                        handler: () => {
                            deleteEpoc(epoc, libraryId);
                            downloadEpoc(epoc, libraryId);
                        },
                    },
                ]
                : []),
            ...(epoc.opened
                ? [
                    {
                        text: t('FLOATING_MENU.RESET'),
                        icon: refreshOutline,
                        handler: () => confirmReset(epoc, libraryId),
                    },
                ]
                : []),
            {
                text: t('FLOATING_MENU.DELETE'),
                icon: trash,
                handler: () => confirmDelete(epoc, libraryId),
            },
            {
                text: t('CLOSE'),
                role: 'cancel',
            },
        ];
        const actionSheet = await actionSheetController.create({
            header: epoc.title,
            cssClass: 'custom-action-sheet',
            subHeader: t('FLOATING_MENU.MAIN_MENU'),
            mode: 'ios',
            buttons,
        });
        document.documentElement.style.setProperty('--thumbnail-url', `url(${epoc.image})`);
        await actionSheet.present();
    }

    async function presentToast(message: string, color?: string) {
        const toast = await toastController.create({
            message,
            duration: 2000,
            color,
        });
        await toast.present();
    }

    async function addCustomCollection(url: string) {
        const error = await checkCustomCollectionUrl(url);
        if (error) {
            await presentToast(error, 'danger');
            return;
        }
        await presentToast('CUSTOM_COLLECTION.SUCCESS', 'success');
        settingsStore.settings.customLibrairies.push(url);
        settingsStore.updateSettings();
        await fetchCustomCollections();
    }

    async function confirmReset(epoc: EpocMetadata, libraryId?: string) {
        const alert = await alertController.create({
            header: 'Confirmation',
            message: `Attention la réinitialisation de l'ePoc <b>"${epoc.title}"</b> supprimera toute votre progression`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
                {
                    text: 'Confirmer',
                    handler: () => {
                        readingStore.removeReading(epoc.id);
                        updateEpocCollectionState(epoc.id, { downloaded: epoc.downloaded, opened: false }, libraryId);
                    },
                },
            ],
        });
        await alert.present();
    }

    async function confirmDelete(epoc: EpocMetadata, libraryId?: string) {
        const alert = await alertController.create({
            header: 'Confirmation',
            message: `Merci de confirmer la suppression de l'ePoc <b>"${epoc.title}"</b>`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
                {
                    text: 'Confirmer',
                    handler: () => {
                        deleteEpoc(epoc, libraryId);
                    },
                },
            ],
        });
        await alert.present();
    }

    async function openAboutPublisher(publisher: Publisher) {
        const message = `PUBLISHER_MODAL.MESSAGE (customize with publisher data)`;
        const alert = await alertController.create({
            header: 'PUBLISHER_MODAL.ABOUT',
            cssClass: 'alert-alignleft',
            message,
            buttons: ['OK'],
        });
        await alert.present();
    }

    // --- Initialization ---
    fetchOfficialCollections();
    settingsStore.$subscribe((_, state) => {
        if (state.settings) {
            fetchCustomCollections();
        }
    });
    readingStore.$subscribe((_, state) => {
        readings.value = state.readings;
    });

    return {
        // State
        officialCollections,
        customCollections,
        epocProgresses,
        // Getters
        getOfficialCollections,
        getCustomCollections,
        getEpocProgresses,
        // Actions
        fetchOfficialCollections,
        fetchCustomCollections,
        readEpocContent,
        updateEpocCollectionState,
        updateEpocProgress,
        downloadEpoc,
        unzipEpoc,
        deleteEpoc,
        checkCustomCollectionUrl,
        epocLibraryMenu,
        presentToast,
        addCustomCollection,
        confirmReset,
        confirmDelete,
        openAboutPublisher,
    };
});
