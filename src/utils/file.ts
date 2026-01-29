import { Zip } from '@epoc/capacitor-zip';
import { Directory, Filesystem, FileInfo, Encoding } from '@capacitor/filesystem';
import { FileTransfer, ProgressStatus } from '@capacitor/file-transfer';



// Map base directories to Capacitor Directory enum
export const BASE_DIR_MAP: Record<string, Directory> = Object.fromEntries(Object.values(Directory).map(v => [`/${v}`, v]).sort((a, b) => b[0].length - a[0].length));


// MIME types for common extensions, including subtitles
export const MIME_TYPES: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogv',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    // Documents
    html: 'text/html',
    pdf: 'application/pdf',
    json: 'application/json',
    txt: 'text/plain',
    csv: 'text/csv',
    // Archives
    zip: 'application/zip',
    // Subtitles
    srt: 'text/srt',
    vtt: 'text/vtt',
    ass: 'text/x-ssa',
    ssa: 'text/x-ssa',
    // Other
    wasm: 'application/wasm',
};

/**
 * Get the MIME type from a file extension.
 * @param filename The filename or path.
 * @returns The MIME type as a string.
 */
export const getMimeType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? MIME_TYPES[extension] || 'application/octet-stream' : 'application/octet-stream';
};


/**
 * Convertit un ArrayBuffer en chaîne Base64.
 * @param buffer - Données à encoder ArrayBuffer.
 * @returns La chaîne encodée en Base64.
 */
export const  arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

export const readdir = async (path: string): Promise<FileInfo[]> => {
    try {
        return (await Filesystem.readdir({ path, directory: Directory.LibraryNoCloud })).files;
    } catch (error) {
        console.error('Error listing directory:', error);
        return [];
    }
};

export const listDirMetadata = readdir;

export const mkdir = async (path: string): Promise<void> => {
    try {
        await Filesystem.mkdir({ directory: Directory.LibraryNoCloud, path, recursive: true });
    } catch (error) {
        // Ignore if folder already exists
    }
}

export const overwrite = async (data: string, filename: string): Promise<void> => {
    try {
        await Filesystem.writeFile({
            path: filename,
            data: data,
            directory: Directory.LibraryNoCloud,
            recursive: true,
            encoding: Encoding.UTF8,
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

export const write = async (data: string, filename: string): Promise<void> => {
    try {
        await Filesystem.appendFile({
            path: filename,
            data: data,
            directory: Directory.LibraryNoCloud
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

export const download = async (
    url: string,
    filename: string,
    onProgress?: (progress: ProgressStatus) => void
): Promise<void> => {
    try {
        const fileUri = await Filesystem.getUri({
            directory: Directory.LibraryNoCloud,
            path: filename,
        });
        await FileTransfer.downloadFile({
            url: url,
            path: fileUri.uri,
        });
        if (onProgress) await FileTransfer.addListener('progress', onProgress);
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

export const deleteZip = async (filename: string): Promise<void> => {
    try {
        return await Filesystem.deleteFile({ directory: Directory.LibraryNoCloud, path: filename });
    } catch (error) {
        console.error('Error deleting file or nothing to delete', error);
    }
};

export const deleteFolder = async (path: string): Promise<void> => {
    try {
        await Filesystem.rmdir({ directory: Directory.LibraryNoCloud, path, recursive: true });
    } catch (error) {
        console.warn('Error deleting folder or nothing to delete', error);
    }
};

export const unzip = async (filename: string, dir: string): Promise<void> => {
    try {
        console.log('Unzipping file:', filename);
        await deleteFolder(dir);
        const fileUri = await Filesystem.getUri({
            directory: Directory.LibraryNoCloud,
            path: filename,
        });
        const extractPath = await Filesystem.getUri({
            directory: Directory.LibraryNoCloud,
            path: dir,
        });
        console.log('unzipping', fileUri.uri, 'to', extractPath.uri);
        await Zip.unzip({
            source: fileUri.uri,
            destination: extractPath.uri,
        });
        console.log('deleting zip file:', filename);
        //await deleteZip(filename);
    } catch (error) {
        console.error('Error unzipping file:', error);
        throw error;
    }
};

export const mv = async (from: string, to: string): Promise<void> => {
    try {
        await Filesystem.rename({
            directory: Directory.LibraryNoCloud,
            from,
            to,
        });
    } catch (error) {
        console.error('Error moving file or folder:', error);
        throw error;
    }
}

export const pathExists = async (path: string): Promise<boolean> => {
    try {
        await Filesystem.stat({ directory: Directory.LibraryNoCloud, path });
        return true;
    } catch {
        return false;
    }
}

export const deleteAllFiles = async (dir = ''): Promise<void> => {
    const items = await readdir(dir);
    for (const item of items) {
        if (item.type === 'directory') {
            await deleteFolder(`${dir}/${item.name}`);
        } else {
            await Filesystem.deleteFile({ directory: Directory.LibraryNoCloud, path: `${dir}/${item.name}` });
        }
    }
}
