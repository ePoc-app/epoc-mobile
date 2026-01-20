// Nom de la base de données IndexedDB et du magasin d'objets
const DB_NAME = "Disc";
const STORE_NAME = "FileStorage";

// Types MIME pour les extensions courantes
const MIME_TYPES = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Vidéos
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
    js: 'application/javascript',
    json: 'application/json',
    pdf: 'application/pdf',
    txt: 'text/plain',
    csv: 'text/csv',
    // Archives
    zip: 'application/zip',
    // Sous-titres
    srt: 'text/srt',
    vtt: 'text/vtt',
    ass: 'text/x-ssa',
    ssa: 'text/x-ssa',
    // Autres
    wasm: 'application/wasm',
};

/**
 * Récupère le type MIME à partir de l'extension du fichier.
 */
function getMimeType(filename) {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? MIME_TYPES[extension] || 'application/octet-stream' : 'application/octet-stream';
}

// Ouvre ou crée la base de données IndexedDB
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "url" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e);
    });
}

// Récupère un fichier depuis IndexedDB
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

// Décode une chaîne Base64 en Uint8Array
function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Décode une chaîne Base64 en texte UTF-8
function base64ToUtf8(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
}

// Événements du Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('[SW] Installé et passe l\'attente');
});

self.addEventListener('activate', (event) => {
    clients.claim();
    console.log('[SW] Activé et prend le contrôle des clients');
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/LIBRARY_NO_CLOUD/")) {
        event.respondWith(
            (async () => {
                try {
                    const url = new URL(event.request.url);
                    const path = url.pathname;
                    console.log(`[SW] Récupération de : ${path}`);

                    const file = await getFileFromDB(path);
                    if (!file) {
                        console.log(`[SW] Fichier introuvable : ${path}`);
                        return new Response("Fichier introuvable dans IndexedDB", { status: 404 });
                    }

                    const type = getMimeType(path);
                    console.log(`[SW] Type MIME déterminé : ${type}`);

                    // Pour les fichiers texte (JS, JSON, HTML, CSS, etc.), décoder en UTF-8
                    if (type.startsWith('text/') || type === 'application/javascript' || type === 'application/json') {
                        const utf8Content = base64ToUtf8(file.content);
                        console.log(`[SW] Contenu UTF-8 décodé pour : ${path}`);
                        console.log(utf8Content)
                        return new Response(utf8Content, {
                            headers: {
                                "Content-Type": type,
                            },
                        });
                    }
                    // Pour les vidéos, gérer les requêtes partielles (Range)
                    else if (type.startsWith('video/') || type.startsWith('audio/')) {
                        const rangeHeader = event.request.headers.get('Range');
                        const decodedContent = base64ToUint8Array(file.content);

                        if (rangeHeader) {
                            const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
                            if (!rangeMatch) {
                                return new Response("En-tête Range invalide", { status: 400 });
                            }
                            const start = parseInt(rangeMatch[1], 10);
                            const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : decodedContent.length - 1;
                            const chunk = decodedContent.slice(start, end + 1);

                            console.log(`[SW] Envoi de contenu partiel (${start}-${end}) pour : ${path}`);
                            return new Response(chunk, {
                                status: 206,
                                headers: {
                                    "Content-Type": type,
                                    "Content-Length": chunk.length.toString(),
                                    "Content-Range": `bytes ${start}-${end}/${decodedContent.length}`,
                                    "Accept-Ranges": "bytes",
                                },
                            });
                        } else {
                            console.log(`[SW] Envoi de contenu complet pour : ${path}`);
                            return new Response(decodedContent, {
                                headers: {
                                    "Content-Type": type,
                                    "Content-Length": decodedContent.length.toString(),
                                    "Accept-Ranges": "bytes",
                                },
                            });
                        }
                    }
                    // Pour les autres fichiers binaires (images, etc.)
                    else {
                        const decodedContent = base64ToUint8Array(file.content);
                        console.log(`[SW] Envoi de contenu binaire pour : ${path}`);
                        return new Response(decodedContent, {
                            headers: {
                                "Content-Type": type,
                                "Content-Length": decodedContent.length.toString(),
                            },
                        });
                    }
                } catch (e) {
                    console.error("[SW] Erreur lors de la récupération du fichier :", e);
                    return new Response("Erreur lors de la récupération du fichier", { status: 500 });
                }
            })()
        );
    }
});
