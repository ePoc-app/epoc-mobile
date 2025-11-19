import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {reactive} from 'vue';

// Map base directories to Capacitor Directory enum
const BASE_DIR_MAP: Record<string, Directory> = Object.fromEntries(Object.values(Directory).map(v => [`/${v}`, v]).sort((a, b) => b[0].length - a[0].length));


// MIME types for common extensions, including subtitles
const MIME_TYPES: Record<string, string> = {
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
const getMimeType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? MIME_TYPES[extension] || 'application/octet-stream' : 'application/octet-stream';
};

/**
 * Convert a file path to a web-compatible URL.
 * For native: Uses Capacitor's convertFileSrc.
 * For web: Reads the file and creates an object URL.
 * @param filePath The file path, e.g., '/DATA/images/example.jpg'.
 * @returns Promise<string> The URL for the file.
 */
export function useConvertFileSrc() {
    const fileUrls = reactive<Record<string, string>>({});

    const convertFileSrc = (filePath: string): string => {
        if (fileUrls[filePath] || Object.prototype.hasOwnProperty.call(fileUrls, filePath)) {
            return fileUrls[filePath]; // Already converted or in progress
        }

        try {
            // Extract the base directory (e.g., '/DATA') and the relative path
            const baseDir = Object.keys(BASE_DIR_MAP).find((dir) => filePath.startsWith(dir));

            if (!baseDir) {
                throw new Error(`Unsupported base directory in path: ${filePath}`);
            }

            const relativePath = filePath.slice(baseDir.length).replace(/^\/+/, '');
            const capacitorDir = BASE_DIR_MAP[baseDir];

            if (Capacitor.getPlatform() !== 'web') {
                // Native: Use Capacitor's convertFileSrc
                return Capacitor.convertFileSrc(filePath);
            } else {
                fileUrls[filePath] = 'loading'; // Mark as loading
                (async () => {
                    try {
                        const result = await Filesystem.readFile({
                            path: relativePath,
                            directory: capacitorDir,
                        });
                        const mimeType = getMimeType(relativePath);
                        const base64Data = result.data;
                        const blob = await (await fetch(`data:${mimeType};base64,${base64Data}`)).blob();
                        fileUrls[filePath] = URL.createObjectURL(blob);
                    } catch (err) {
                        console.error('Error converting file path to URL:', err);
                    }
                })();
                return fileUrls[filePath]; // Return 'loading' initially
            }
        } catch (err) {
            console.error('Error converting file path to URL:', err);
            throw err;
        }
    };

    return {
        convertFileSrc,
    };
}
