import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { actionSheetController, alertController, toastController } from '@ionic/vue';
import {
    arrayBufferToBase64,
    deleteFolder,
    download,
    mkdir,
    mv, overwrite,
    pathExists,
    readdir,
    unzip,
    write,
} from '@/utils/file';
import { EpocLibrary } from '@/types/epoc';
import { readEpocContent } from '@/utils/epocService';
import { trackEvent } from '@/utils/matomo';
import { listCircleOutline, starOutline, trash } from 'ionicons/icons';

export const useLocalEpocsStore = defineStore('localEpocs', () => {

    const localEpocs = ref<EpocLibrary[]>([]);
    const imports = ref<{ [key: string]: string }>({});

    const router = useRouter();
    const { t } = useI18n(); // t is equivalent to translate.instant

    const fetchLocalEpocs = async () => {
        await mkdir('local-epocs');
        try {
            const files = await readdir('local-epocs');
            const dirs = files
                .filter((f: any) => f.type === 'directory')
                .sort((fileA: any, fileB: any) => {
                    return new Date(fileA.metadata?.modificationTime) > new Date(fileB.metadata?.modificationTime)
                        ? 1
                        : -1;
                });

            console.log('Dirs');
            console.log(dirs);

            // Backwards compatibility for old local ePocs without prefix
            for (const dir of dirs) {
                if (!dir.name.startsWith('local-')) {
                    console.log(`Backward Compatibility: Renaming dir ${dir.name}`);
                    const epoc = await readEpocContent('local-epocs', dir.name);
                    if (epoc) {
                        console.log(`Backward Compatibility: Moving dir ${dir.name} to ${epoc.id}`);
                        try {
                            console.log(`Moving dir ${dir.name} to ${epoc.id} to avoid conflicts with new naming convention`);
                            await mv(`local-epocs/${dir.name}`, `local-epocs/${epoc.id}`);
                            dir.name = epoc.id;
                        } catch (error) {
                            console.log('Error during backward compatibility rename, trying again by using dir.name', error);
                            console.log(`Backward Compatibility: Moving dir ${dir.name} to local-${dir.name}`);
                            try {
                                console.log(`Changing epoc id to ${dir.name} in content.json for ePoc`);
                                epoc.id = dir.name;
                                await overwrite(JSON.stringify(epoc), `local-epocs/${dir.name}/content.json`);
                                console.log(`Moving dir ${dir.name} to local-${dir.name} to avoid conflicts with new naming convention`);
                                await mv(`local-epocs/${dir.name}`, `local-epocs/local-${dir.name}`);
                                dir.name = `local-${dir.name}`;
                            } catch (error) {
                                console.error('Error during backward compatibility rename', error);
                            }
                        }
                    }
                }
            }

            const epocContents = await Promise.all(dirs.map((file: any) => readEpocContent('local-epocs', file.name)));

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
                    ),
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
        const tempId = (Math.random() + 1).toString(36).substring(3);
        imports.value = { ...imports.value, [tempId]: `${t('LIBRARY_PAGE.IMPORT')} ${file.name}` };
        trackEvent('Local ePocs', 'Import from file', file.name);

        try {
            // Convert JS File object to Base64 for Capacitor Filesystem
            const data = arrayBufferToBase64(await file.arrayBuffer());
            await write(data, `local-epocs/${tempId}.zip`);
            await unzipLocalEpoc(tempId);
        } catch (error) {
            console.error(error);
            showToast(t('FLOATING_MENU.ERROR'), 'danger');
            const newImports = { ...imports.value };
            delete newImports[tempId];
            imports.value = newImports;
        }
    };

    const unzipLocalEpoc = async (tempId: string) => {
        imports.value[tempId] = t('LIBRARY_PAGE.OPEN_ZIP');
        try {
            await unzip(`local-epocs/${tempId}.zip`, `temp/${tempId}`);

            const epoc = await readEpocContent('temp', tempId);

            console.log(epoc);

            if (epoc) {
                const dirExist = await pathExists(`local-epocs/${epoc.id}`);

                // If directory with same epoc id exists, ask for confirmation to replace
                if (!dirExist) {
                    trackEvent(epoc.id, `${epoc.id} / Imported`);
                    await mv(`temp/${tempId}`, `local-epocs/${epoc.id}`);
                } else {
                    const alert = await alertController.create({
                        header: 'Confirmation',
                        message: `Cet ePoc existe déjà "${epoc.id} : ${epoc.title}"`,
                        buttons: [
                            {
                                text: 'Annuler',
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: async () => {
                                    await deleteFolder(`temp/${tempId}`);
                                },
                            },
                            {
                                text: 'Confirmer',
                                handler: async () => {
                                    trackEvent(epoc.id, `${epoc.id} / Updated`);
                                    await deleteFolder(`local-epocs/${epoc.id}`);
                                    await mv(`temp/${tempId}`, `local-epocs/${epoc.id}`);
                                },
                            },
                        ],
                    });

                    await alert.present();
                }
            }

            const newImports = { ...imports.value };
            delete newImports[tempId];
            imports.value = newImports;

            await fetchLocalEpocs();
        } catch (error) {
            console.error(error);
            showToast(t('FLOATING_MENU.ERROR'), 'danger');

            const newImports = { ...imports.value };
            delete newImports[tempId];
            imports.value = newImports;
        }
    };

    const deleteEpoc = async (epoc: EpocLibrary) => {
        localEpocs.value = localEpocs.value.filter((e) => e.id !== epoc.id);
        router.push('/library');
        trackEvent(epoc.id, 'Deleted');
        await deleteFolder(`local-epocs/${epoc.id}`);
        await fetchLocalEpocs();
    };

    // --- UI Actions ---

    const showToast = async (message: string, color?: string) => {
        const toast = await toastController.create({
            message,
            color,
            position: 'top',
            duration: 2000,
        });
        await toast.present();
    };

    const localEpocLibraryMenu = async (epoc: EpocLibrary) => {
        const buttons = [
            {
                text: t('FLOATING_MENU.TOC'),
                icon: listCircleOutline,
                handler: () => {
                    router.push('/epoc/toc/' + epoc.id);
                },
            },
            {
                text: t('FLOATING_MENU.SCORE_DETAILS'),
                icon: starOutline,
                handler: () => {
                    router.push('/epoc/score/' + epoc.id);
                },
            },
            {
                text: t('FLOATING_MENU.DELETE'),
                icon: trash,
                handler: () => {
                    confirmDelete(epoc);
                },
            },
            {
                text: 'Fermer',
                role: 'cancel',
            },
        ];

        const actionSheet = await actionSheetController.create({
            header: epoc.title,
            subHeader: t('FLOATING_MENU.MAIN_MENU'),
            cssClass: 'custom-action-sheet',
            mode: 'ios',
            buttons,
        });

        await actionSheet.present();
    };

    const confirmDelete = async (epoc: EpocLibrary) => {
        const alert = await alertController.create({
            header: 'Confirmation',
            message: `Merci de confimer la suppresion de l'ePoc "${epoc.title}"`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
                {
                    text: 'Confirmer',
                    handler: () => {
                        deleteEpoc(epoc);
                    },
                },
            ],
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
        localEpocLibraryMenu,
    };
});
