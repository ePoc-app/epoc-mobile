// Name of your IndexedDB database and object store
const DB_NAME = "Disc";
const STORE_NAME = "FileStorage";

// MIME types for common extensions, including subtitles
const MIME_TYPES = {
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
    css: 'text/css',
    js: 'text/js',
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
function getMimeType (filename){
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? MIME_TYPES[extension] || 'application/octet-stream' : 'application/octet-stream';
};

// Open or create the IndexedDB database
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "url" });
            }
        };

        request.onsuccess = () => {
            return resolve(request.result);
        }
        request.onerror = (e) => reject(e);
    });
}

// Fetch the file from IndexedDB
async function getFileFromDB(url) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(url);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e);
    });
}

// Helper function to decode Base64 to Uint8Array
function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Service Worker fetch event
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/LIBRARY_NO_CLOUD/")) {
        event.respondWith(
            (async () => {
                try {
                    const url = new URL(event.request.url);
                    const path = url.pathname;
                    const file = await getFileFromDB(path);
                    if (!file) {
                        return new Response("File not found in IndexedDB", { status: 404 });
                    }

                    const type = getMimeType(path);

                    // Decode Base64 content
                    const decodedContent = base64ToUint8Array(file.content);

                    // For video files, support range requests
                    const rangeHeader = event.request.headers.get('Range');
                    if (rangeHeader && type.startsWith('video/')) {
                        const range = rangeHeader.replace(/bytes=/, "").split("-");
                        const start = parseInt(range[0], 10);
                        const end = range[1] ? parseInt(range[1], 10) : decodedContent.length - 1;
                        const chunkSize = end - start + 1;
                        const chunk = decodedContent.slice(start, end + 1);

                        return new Response(chunk, {
                            status: 206, // Partial Content
                            headers: {
                                "Content-Type": type,
                                "Content-Length": chunkSize.toString(),
                                "Content-Range": `bytes ${start}-${end}/${decodedContent.length}`,
                                "Accept-Ranges": "bytes",
                            },
                        });
                    } else {
                        // For non-video files or full requests
                        return new Response(decodedContent, {
                            headers: {
                                "Content-Type": type,
                                "Content-Length": decodedContent.length.toString(),
                                "Accept-Ranges": "bytes",
                            },
                        });
                    }
                } catch (e) {
                    console.error("Error fetching file from IndexedDB:", e);
                    return new Response("Error fetching file", { status: 500 });
                }
            })()
        );
    }
});

