import { ref, onUnmounted } from 'vue';
import type { PluginEntry } from '@/types/plugin';
import type { Epoc } from '@/types/epoc';

/**
 * Composable to manage sandboxed plugins via iframes.
 * Handles plugin lifecycle, shortcode embedding, and cross-iframe communication.
 */
export function usePlugin() {
    const plugins = ref<PluginEntry[]>([]);
    const rootFolder = ref<string>('');
    const allPluginLoaded = ref<Promise<boolean[]>>();

    // Keep track of event listeners for clean cleanup
    const activeListeners = new Set<{ handler: (e: MessageEvent) => void }>();

    /**
     * Initializes plugins by creating hidden background iframes and pre-fetching templates.
     * @param rootFolderValue Base path for plugin assets
     * @param epoc The project data containing plugin definitions
     */
    function init(rootFolderValue: string, epoc: Epoc) {
        if (!epoc.plugins) return;
        console.log(`Initializing ${epoc.plugins.length} plugins...`);
        rootFolder.value = rootFolderValue;

        // Cleanup previous instances
        document.querySelector('.plugins-wrapper')?.remove();
        plugins.value = [];

        // Wrapper for "logic" iframes (invisible background processes)
        const wrapper = Object.assign(document.createElement('div'), { className: 'plugins-wrapper' });
        document.body.appendChild(wrapper);

        const pluginLoadingPromises: Promise<boolean>[] = epoc.plugins.map((src) => {
            return new Promise((resolve) => {
                const url = `${rootFolderValue}${src}`;
                const iframe = document.createElement('iframe');
                const uid = (Math.random() + 1).toString(36).substring(3);

                // Construct logic iframe: loads the plugin-api and the plugin's own script
                const html = `<body>
                    <script src="${document.baseURI}assets/js/plugin-api.js" uid="${uid}"></script>
                    <script src="${url}"></script>
                </body>`;

                iframe.id = `plugin-${uid}`;
                iframe.sandbox.add('allow-scripts', 'allow-same-origin');
                iframe.classList.add('plugin', 'invisible');
                iframe.srcdoc = html;
                wrapper.appendChild(iframe);

                const context = { url, epoc };

                const messageHandler = async (message: MessageEvent) => {
                    if (message.data.pluginId !== uid) return;

                    // 1. Initial Load: Plugin logic script is ready
                    if (message.data.event === 'load' && !plugins.value.some((p) => p.uid === uid)) {
                        iframe.contentWindow?.postMessage({ event: 'load', context }, '*');
                    }

                    // 2. Config Received: Plugin has sent its manifest/config
                    if (message.data.event === 'config' && !plugins.value.some((p) => p.uid === uid)) {
                        let templateSource = message.data.config.template;

                        // If template is a URL, fetch it now so 'embed()' can be synchronous later
                        if (templateSource.endsWith('.html')) {
                            try {
                                const pluginSubDir = src.split('/')[0];
                                const templateUrl = `${rootFolderValue}${pluginSubDir}/${templateSource}`;
                                const response = await fetch(templateUrl);
                                templateSource = await response.text();
                            } catch (e) {
                                console.error(`Failed to prefetch template for ${uid}`, e);
                            }
                        }

                        const plugin: PluginEntry = {
                            uid,
                            src,
                            config: { ...message.data.config, template: templateSource },
                            embeds: []
                        };
                        plugins.value.push(plugin);
                        console.log(`Plugin loaded: ${uid}`, plugin);
                        resolve(true);
                    }

                    // 3. Routing: Logic -> Embed communication
                    if (message.data.event === 'to-embed') {
                        const plugin = plugins.value.find((p) => p.uid === uid);
                        plugin?.embeds.forEach((embedId) => {
                            const embedIframe = document.getElementById(`embed-${uid}-${embedId}`) as HTMLIFrameElement;
                            embedIframe?.contentWindow?.postMessage(message.data.payload, '*');
                        });
                    }

                    // 4. Routing: Embed -> Logic communication
                    if (message.data.embedId) {
                        const plugin = plugins.value.find((p) => p.uid === uid);
                        if (!plugin) return;
                        const pluginIframe = document.getElementById(`plugin-${plugin.uid}`) as HTMLIFrameElement;

                        if (message.data.event === 'embed-loaded') {
                            if (!plugin.embeds.includes(message.data.embedId)) {
                                plugin.embeds.push(message.data.embedId);
                                pluginIframe?.contentWindow?.postMessage({ event: 'embed', embedId: message.data.embedId }, '*');
                            }
                        } else if (message.data.event === 'setIframeHeight') {
                            const embedIframe = document.getElementById(`embed-${plugin.uid}-${message.data.embedId}`) as HTMLIFrameElement;
                            if (embedIframe) embedIframe.style.height = `${message.data.height}px`;
                        } else {
                            pluginIframe?.contentWindow?.postMessage(message.data.payload, '*');
                        }
                    }
                };

                window.addEventListener('message', messageHandler);
                activeListeners.add({ handler: messageHandler });
            });
        });

        allPluginLoaded.value = Promise.all(pluginLoadingPromises);
    }

    /**
     * Replaces [#shortcode] tags with iframe strings.
     * Note: Requires init() to have finished (allPluginLoaded resolved).
     */
    function embed(html: string): string {
        console.log('Embedding plugins into content...', html);
        const shortcodes = html.match(/\[#[^\]]+\]/gm);
        if (!shortcodes) return html;

        let processedHtml = html;
        for (const shortcode of shortcodes) {
            const shortcodeMatch = shortcode.match(/\[#(\S+)[^\]]*]/);
            if (!shortcodeMatch) continue;

            console.log(`Processing shortcode: ${shortcode}`);

            const shortcodeName = `[#${shortcodeMatch[1]}]`;

            // Extract attributes: key="value"
            const data: Record<string, string> = {};
            const keyValuePairs = shortcode.match(/(\w+)="([^"]*)"/g);
            keyValuePairs?.forEach(pair => {
                const [key, value] = pair.split('=');
                data[key] = value.replace(/"/g, '');
            });

            console.log(plugins.value);

            const plugin = plugins.value.find((p) => p.config.shortcode === shortcodeName);
            if (plugin) {
                console.log(`Embedding plugin ${plugin.uid} for shortcode ${shortcode}`);
                const iframeHtml = createEmbeddedIframe(plugin, data);
                processedHtml = processedHtml.replace(shortcode, iframeHtml);
            }
        }
        return processedHtml;
    }

    /**
     * Creates the HTML string for the UI-facing iframe.
     * This is now fully synchronous because templates are pre-loaded in init().
     */
    function createEmbeddedIframe(plugin: PluginEntry, data?: unknown): string {
        const uidEmbed = (Math.random() + 1).toString(36).substring(3);

        const pluginEmbedHead = `
            <link rel="stylesheet" href="/assets/css/plugin-embed.css">
            <script>
                window.pluginId = '${plugin.uid}';
                window.embedId = '${uidEmbed}';
                window.pluginData = ${JSON.stringify(data || {})};
            </script>
            <script src="${document.baseURI}assets/js/plugin-api-embed.js"></script>
        `;

        // Check if the template is raw HTML or a fetched template string
        const isFullHtml = plugin.config.template.includes('<body') || plugin.config.template.includes('<html');

        let finalHtml = '';
        if (isFullHtml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(plugin.config.template, 'text/html');
            doc.head.innerHTML = pluginEmbedHead + doc.head.innerHTML;
            finalHtml = doc.documentElement.innerHTML;
        } else {
            finalHtml = `<html><head>${pluginEmbedHead}</head><body>${plugin.config.template}</body></html>`;
        }

        return `<iframe 
            id="embed-${plugin.uid}-${uidEmbed}" 
            class="plugin embed" 
            sandbox="allow-scripts" 
            srcdoc="${finalHtml.replace(/"/g, '&quot;')}"
        ></iframe>`;
    }

    function broadcastMessage (message: string) {
        document.querySelectorAll('iframe').forEach(frame => {
            frame.contentWindow?.postMessage(message, '*')
        });
    }

    // --- Lifecycle Cleanup ---
    onUnmounted(() => {
        activeListeners.forEach(item => window.removeEventListener('message', item.handler));
        activeListeners.clear();
        document.querySelector('.plugins-wrapper')?.remove();
    });

    return {
        plugins,
        allPluginLoaded,
        init,
        embed,
        createEmbeddedIframe,
        broadcastMessage
    };
}