import {Epoc, EpocLibrary} from '@/types/epoc';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';
import {download, unzip} from '@/utils/file';


export const readEpocContent = async (dir: string, epocId: string): Promise<Epoc | null> => {
    try {
        const file = await Filesystem.readFile({
            path: `${dir}/${epocId}/content.json`,
            directory: Directory.LibraryNoCloud,
            encoding: Encoding.UTF8,
        });

        const ePocBaseUri = await Filesystem.getUri({
            directory: Directory.LibraryNoCloud,
            path: `${dir}/${epocId}`
        });

        let rawData = await (typeof file.data === 'string' ? Promise.resolve(file.data) : file.data.text())

        if (!Capacitor.isNativePlatform()) {
            rawData = atob(rawData);
        }

        const epoc = JSON.parse(rawData) as EpocLibrary;
        epoc.dir = ePocBaseUri.uri;
        return epoc;
    } catch (error) {
        return null;
    }
}
