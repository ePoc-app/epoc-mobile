import { Zip } from '@epoc/capacitor-zip';
import { Directory, Filesystem, FileInfo } from '@capacitor/filesystem';
import { FileTransfer, ProgressStatus } from '@capacitor/file-transfer';

export const readdir = async (path: string): Promise<FileInfo[]> => {
    try {
        await new Promise<void>((resolve) => {
            document.addEventListener('deviceready' as any, resolve, { once: true });
        });
        return (await Filesystem.readdir({ path, directory: Directory.LibraryNoCloud })).files;
    } catch (error) {
        console.error('Error listing directory:', error);
        return [];
    }
};

export const listDirMetadata = readdir;

export const download = async (
    url: string,
    filename: string,
    onProgress: (progress: ProgressStatus) => void
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
        await FileTransfer.addListener('progress', onProgress);
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
        await deleteFolder(dir);
        const fileUri = await Filesystem.getUri({
            directory: Directory.LibraryNoCloud,
            path: filename,
        });
        const extractPath = await Filesystem.getUri({
            directory: Directory.LibraryNoCloud,
            path: dir,
        });
        await Zip.unzip({
            source: fileUri.uri,
            destination: extractPath.uri,
        });
        // await deleteZip(filename);
    } catch (error) {
        console.error('Error unzipping file:', error);
        throw error;
    }
};
