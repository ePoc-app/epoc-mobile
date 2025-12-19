import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { actionSheetController, alertController, toastController } from '@ionic/vue';
import { useSettingsStore } from './settingsStore';
import { useReadingStore } from './readingStore';
import {deleteFolder, download, mkdir, mv, readdir, unzip} from '@/utils/file';
import { EpocLibrary } from '@/types/epoc';
import {readEpocContent} from '@/utils/epocService';
import {trackEvent} from '@/utils/matomo';

export const useLocalEpocsStore = defineStore('localEpocs', () => {
    // --- State ---
    const localEpocs = ref<EpocLibrary[]>([]);
    const imports = ref<{ [key: string]: string }>({});

    // --- Composables ---
    const router = useRouter();
    const { t } = useI18n(); // t is equivalent to translate.instant
    const settingsStore = useSettingsStore();
    const readingStore = useReadingStore();

    // --- Helpers ---
    const simpleHash = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = hash * 31 + char;
        }
        return hash.toString(36).substring(0, 6).toUpperCase();
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
        });
    };

    // --- Actions ---

    const fetchLocalEpocs = async () => {
        await mkdir('local-epocs');
        try {
            const files = await readdir('local-epocs');
            const dirs = files.filter((f: any) => f.type === 'directory')
            .sort((fileA: any, fileB: any) => {
                return new Date(fileA.metadata.modificationTime) > new Date(fileB.metadata.modificationTime) ? 1 : -1;
            });

            const epocContents = await Promise.all(
                dirs.map((file: any) => readEpocContent('local-epocs', file.name))
            );

            localEpocs.value = epocContents.reduce((acc: EpocLibrary[], epocMetadata) => {
                acc.push({
                    ...epocMetadata,
                    downloading: false,
                    downloaded: true,
                    unzipping: false,
                    opened: false,
                    updateAvailable: false,
                    lastModified: new Date().toISOString(),
                    lang: '',
                    translation: '',
                    chaptersCount: Object.keys(epocMetadata.chapters || {}).length,
                    assessmentsCount: Object.values(epocMetadata.contents || {}).reduce(
                        (count: number, content: any) => {
                            return content.type === 'assessment' ? count + 1 : count;
                        },
                        0
                    )
                });
                return acc;
            }, []);
        } catch (error) {
            console.error('Error fetching local epocs', error);
        }
    };

    const downloadLocalEpoc = async (url: string) => {
        if (!url.startsWith('https')) {
            showToast(t('FLOATING_MENU.ERROR_SSL'), 'danger');
            return;
        }

        const tempId = (Math.random() + 1).toString(36).substring(3);

        imports.value = { ...imports.value, [tempId]: t('LIBRARY_PAGE.DOWNLOADING') };
        trackEvent('Local ePocs', 'Import from URL', url);

        try {
            await download(url, `local-epocs/${tempId}.zip`);
            await unzipLocalEpoc(tempId);
        } catch (error) {
            showToast(t('FLOATING_MENU.ERROR'), 'danger');
            const newImports = { ...imports.value };
            delete newImports[tempId];
            imports.value = newImports;
        }
    };

    const importFile = async (file: File) => {
        const id = simpleHash(file.name);
        imports.value = { ...imports.value, [id]: `${t('LIBRARY_PAGE.IMPORT')} ${file.name}` };
        trackEvent('Local ePocs', 'Import from file', file.name);

        try {
            // Convert JS File object to Base64 for Capacitor Filesystem
            const data = await blobToBase64(file);

            await Filesystem.writeFile({
                path: `local-epocs/${id}.zip`,
                data: data,
                directory: Directory.Data,
                recursive: true
            });

            await unzipLocalEpoc(id);
        } catch (error) {
            console.error(error);
            showToast(t('FLOATING_MENU.ERROR'), 'danger');
            const newImports = { ...imports.value };
            delete newImports[id];
            imports.value = newImports;
        }
    };

    const unzipLocalEpoc = async (tempId: string) => {
        imports.value[tempId] = t('LIBRARY_PAGE.OPEN_ZIP');

        try {
            await unzip(`local-epocs/${tempId}.zip`, `local-epocs/${tempId}`);

            const newImports = { ...imports.value };
            delete newImports[tempId];
            imports.value = newImports;

            const epoc = await readEpocContent('local-epocs', tempId);

            if (epoc) {
                await mv(`local-epocs/${tempId}`, `local-epocs/${epoc.id}`);
            }

            await fetchLocalEpocs();
        } catch (error) {
        }
    };

    const deleteEpoc = async (dir: string) => {
        await deleteFolder(dir);
        await fetchLocalEpocs();
    };

    // --- UI Actions ---

    const showToast = async (message: string, color?: string) => {
        const toast = await toastController.create({
            message,
            color,
            position: 'top',
            duration: 2000
        });
        await toast.present();
    };

    const localEpocLibraryMenu = async (epoc: EpocLibrary) => {
        const buttons = [
            {
                text: t('FLOATING_MENU.TOC'),
                icon: 'list-circle-outline',
                handler: () => {
                    router.push('/epoc/toc/' + epoc.id);
                }
            },
            {
                text: t('FLOATING_MENU.SCORE_DETAILS'),
                icon: 'star-outline',
                handler: () => {
                    router.push('/epoc/score/' + epoc.id);
                }
            },
            {
                text: t('FLOATING_MENU.DELETE'),
                icon: 'trash',
                handler: () => {
                    confirmDelete(epoc);
                }
            },
            {
                text: 'Fermer',
                role: 'cancel'
            }
        ];

        const actionSheet = await actionSheetController.create({
            header: epoc.title,
            subHeader: t('FLOATING_MENU.MAIN_MENU'),
            cssClass: 'custom-action-sheet',
            mode: 'ios',
            buttons
        });

        // Setting CSS variable on document root (careful with this in SPA, might want to scope it)
        document.documentElement.style.setProperty('--thumbnail-url', `url(${epoc.image})`);
        await actionSheet.present();
    };

    const confirmDelete = async (epoc: EpocLibrary) => {
        const alert = await alertController.create({
            header: 'Confirmation',
            message: `Merci de confimer la suppresion de l'ePoc <b>"${epoc.title}"</b>`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        deleteEpoc(epoc.dir);
                    }
                }
            ]
        });

        await alert.present();
    };



    // --- Initialization ---
    fetchLocalEpocs().then();

    return {
        localEpocs,
        imports,
        fetchLocalEpocs,
        downloadLocalEpoc,
        importFile,
        deleteEpoc,
        localEpocLibraryMenu
    };
});