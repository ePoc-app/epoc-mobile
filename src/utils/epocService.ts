import {Epoc} from '@/types/epoc';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';


export const readEpocContent = async (dir: string, epocId: string): Promise<Epoc | null> => {
    if (dir === 'epoc-editor') {
        const epoc = await fetch(`/assets/demo/epocs/${epocId}/content.json`).then(res => res.json()) as Epoc;
        epoc.id = epocId;
        epoc.dir = `/assets/demo/epocs/${epocId}/`;
        return epoc;
    }
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

        let epoc: Epoc;
        const rawData = await (typeof file.data === 'string' ? Promise.resolve(file.data) : file.data.text())
        const isBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(rawData);
        if (isBase64) {
            // Decode Base64 to UTF-8
            const binaryString = atob(rawData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const utf8String = new TextDecoder('utf-8').decode(bytes);
            epoc = JSON.parse(utf8String);
        } else {
            epoc = JSON.parse(rawData);
        }

        epoc.dir = ePocBaseUri.uri;

        if (dir === 'local-epocs' || dir === 'temp') {
            epoc.id = `local-${epoc.id}`;
        }

        return epoc;
    } catch (error) {
        return null;
    }
}
