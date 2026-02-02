import { useReadingStore } from '@/stores/readingStore';
import { readEpocContent } from '@/utils/epocService';
import { mv, overwrite } from '@/utils/file';
import { FileInfo } from '@capacitor/filesystem';

/**
 * Moves old local ePocs with random IDs to new naming convention with 'local-' prefix followed by epoc ID
 * @param dirs - Array of FileInfo objects representing local ePocs directories
 * @version 2.0.0
 */
export async function moveOldEpocsWithRandomIds(dirs: FileInfo[]) {
    const readingStore = useReadingStore();
    await readingStore.fetchReadings();

    console.log('FETCH READING', readingStore.readings);

    for (const dir of dirs) {
        if (!dir.name.startsWith('local-')) {
            console.log(`Backward Compatibility: Renaming dir ${dir.name}`);
            const epoc = await readEpocContent('local-epocs', dir.name);
            if (epoc) {
                console.log(`Backward Compatibility: Moving dir ${dir.name} to ${epoc.id}`);
                try {
                    console.log(`Moving dir ${dir.name} to ${epoc.id} to avoid conflicts with new naming convention`);
                    await mv(`local-epocs/${dir.name}`, `local-epocs/${epoc.id}`);
                    console.log(`Duplicate reading ${dir.name} to ${epoc.id} to avoid conflicts with new naming convention`);
                    readingStore.duplicateReading(dir.name, epoc.id);
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
                        readingStore.duplicateReading(dir.name, `local-${dir.name}`);
                        dir.name = `local-${dir.name}`;
                    } catch (error) {
                        console.error('Error during backward compatibility rename', error);
                    }
                }
            }
        }
    }
}