// src/composables/usePlugin.ts
import { ref, onUnmounted } from 'vue';
import type { PluginEntry, Epoc } from '@/types/plugin';

export function usePlugin() {
    const plugins = ref<PluginEntry[]>([]);
    const rootFolder = ref<string>('');
    const allPluginLoaded = ref<Promise<boolean[]>>();

    // --- Core Logic ---
    function init(rootFolderValue: string, epoc: Epoc) {
        if (!epoc.plugins) return;
        rootFolder.value = rootFolderValue;
        // Clear old wrapper and plugins
        document.querySelector('.plugins-wrapper')?.remove();
        plugins.value = [];
        // Create a node wrapper to host all hidden plugin iframes
        const wrapper = Object.assign(document.createElement('div'), { className: 'plugins-wrapper' });
        document.body.appendChild(wrapper);
        const pluginLoadingPromises: Promise<boolean>[] = [];
        epoc.plugins.forEach((src) => {
            const pluginPromise: Promise<boolean> = new Promise((resolve) => {
                const url = rootFolderValue.startsWith('assets/demo')
                    ? `${document.baseURI}${rootFolderValue}${src}`
                    : `${rootFolderValue}${src}`;
                const iframe = document.createElement('iframe');
                const uid = (Math.random() + 1).toString(36).substring(3);
                const html = `<body>
          <script src="${document.baseURI}assets/js/plugin-api.js" uid="${uid}"></script>
          <script src="${url}"></script>
        </body>`;
                iframe.id = `plugin-${uid}`;
                iframe.sandbox.toggle('allow-scripts');
                iframe.classList.add('plugin', 'invisible');
                iframe.srcdoc = html;
                wrapper.appendChild(iframe);
                const context = { url, epoc };

                // Setup listener to received messages from iframes (plugin or embeds)
                const messageHandler = (message: MessageEvent) => {
                    if (message.data.pluginId && message.data.pluginId === uid) {
                        // Setup listener when plugin iframe loads and send message to retrieve config with context
                        if (message.data.event === 'load' && !plugins.value.some((p) => p.uid === uid)) {
                            iframe.contentWindow?.postMessage({ event: 'load', context }, '*');
                        }
                        // When plugin finished loading, store plugin config and infos
                        if (message.data.event === 'config' && !plugins.value.some((p) => p.uid === uid)) {
                            const plugin: PluginEntry = { uid, src, config: message.data.config, embeds: [] };
                            plugins.value.push(plugin);
                            resolve(true);
                        }
                        // Redirects messages 'to-embed' from plugin iframe to embeds iframes
                        if (message.data.event === 'to-embed') {
                            const plugin = plugins.value.find((p) => p.uid === uid);
                            if (!plugin) return;
                            plugin.embeds.forEach((embedId) => {
                                const embedIframe = document.getElementById(`embed-${uid}-${embedId}`) as HTMLIFrameElement;
                                if (!embedIframe) return;
                                embedIframe.contentWindow?.postMessage(message.data.payload, '*');
                            });
                        }
                        // Messages from embeds iframes
                        if (message.data.embedId) {
                            const plugin = plugins.value.find((p) => p.uid === uid);
                            if (!plugin) return;
                            const pluginIframe = document.getElementById(`plugin-${plugin.uid}`) as HTMLIFrameElement;
                            // When embed finishes loading, register new embed into plugin embeds list
                            if (message.data.event === 'embed-loaded') {
                                if (!plugin.embeds.includes(message.data.embedId)) {
                                    plugin.embeds.push(message.data.embedId);
                                    pluginIframe.contentWindow?.postMessage(
                                        { event: 'embed', embedId: message.data.embedId },
                                        '*'
                                    );
                                }
                            }
                            // Check if the message is to set the iframe height
                            else if (message.data.event === 'setIframeHeight') {
                                const selector = `embed-${plugin.uid}-${message.data.embedId}`;
                                const embedIframe = document.getElementById(selector) as HTMLIFrameElement;
                                if (!embedIframe) return;
                                embedIframe.style.height = message.data.height + 'px';
                            }
                            // Else redirect message from embed to main plugin iframe
                            else {
                                pluginIframe.contentWindow?.postMessage(message.data.payload, '*');
                            }
                        }
                    }
                };
                window.addEventListener('message', messageHandler);
            });
            pluginLoadingPromises.push(pluginPromise);
        });
        allPluginLoaded.value = Promise.all(pluginLoadingPromises);
    }

    async function embed(html: string): Promise<string> {
        await allPluginLoaded.value;
        const shortcodes = html.match(/\[#[^\]]+\]/gm);
        if (!shortcodes) return html;
        for (const shortcode of shortcodes) {
            const shortcodeMatch = shortcode.match(/\[#(\S+)[^\]]*]/);
            if (shortcodeMatch) {
                const shortcodeName = `[#${shortcodeMatch[1]}]`;
                const keyValuePairs = shortcode.match(/(\w+)="([^"]*)"/g);
                const data: Record<string, string> = {};
                if (keyValuePairs) {
                    for (const pair of keyValuePairs) {
                        const [, key, value] = pair.match(/(\w+)="([^"]*)"/) || [];
                        data[key] = value;
                    }
                }
                const plugin = plugins.value.find((p) => p.config.shortcode === shortcodeName);
                if (plugin) {
                    const iframeHtml = await createEmbeddedIframe(plugin, data);
                    html = html.replace(shortcode, iframeHtml);
                }
            }
        }
        return html;
    }

    async function createEmbeddedIframe(plugin: PluginEntry, data?: unknown): Promise<string> {
        if (!plugin) return 'No plugin found';
        const iframe = document.createElement('iframe');
        const uid = plugin.uid;
        const uidEmbed = (Math.random() + 1).toString(36).substring(3);
        iframe.sandbox.toggle('allow-scripts');
        iframe.className = 'plugin embed';
        iframe.id = `embed-${uid}-${uidEmbed}`;
        const pluginEmbedHead = `
      <link rel="stylesheet" href="/assets/css/plugin-embed.css">
      <script>
        const pluginId = '${uid}';
        const embedId = '${uidEmbed}';
        const pluginData = ${JSON.stringify(data ? data : {})};
      </script>
      <script src="${document.baseURI}assets/js/plugin-api-embed.js"></script>
    `;
        if (plugin.config.template.endsWith('.html')) {
            const rootUrl = rootFolder.value.startsWith('assets/demo')
                ? `${document.baseURI}${rootFolder.value}`
                : `${rootFolder.value}`;
            const templateUrl = `${rootUrl}${plugin.src.split('/')[0]}/${plugin.config.template}#${uid}-${uidEmbed}`;
            const templateString = await (await fetch(templateUrl)).text();
            const parser = new DOMParser();
            const templateHtml = parser.parseFromString(templateString, 'text/html');
            templateHtml.head.innerHTML += pluginEmbedHead;
            iframe.srcdoc = templateHtml.documentElement.innerHTML;
        } else {
            iframe.srcdoc = `
        <head>
          ${pluginEmbedHead}
        </head>
        <body>
          ${plugin.config.template}
        </body>`;
        }
        return iframe.outerHTML;
    }

    async function createEmbeddedIframeFromTemplateName(templateName: string, data?: unknown): Promise<string> {
        const pluginEntry = plugins.value.find((p) => p.config.template === templateName);
        if (!pluginEntry) return 'No plugin found';
        return createEmbeddedIframe(pluginEntry, data);
    }

    function broadcastMessage(message: any) {
        document.querySelectorAll('iframe').forEach((frame) => {
            frame.contentWindow?.postMessage(message, '*');
        });
    }

    function genericHook(name: string, ...args: any[]) {
        // Implement if needed
    }

    function onLoad(): void {
        genericHook('onLoad');
    }

    function onChapterStart(): void {
        genericHook('onChapterStart');
    }

    function onChapterEnd(): void {
        genericHook('onChapterEnd');
    }

    function onContentEnter(): void {
        genericHook('onContentEnter');
    }

    function onContentLeave(): void {
        genericHook('onContentLeave');
    }

    function onActivityStart(): void {
        genericHook('onActivityStart');
    }

    function onActivityEnd(): void {
        genericHook('onActivityEnd');
    }

    function onQuestion(): void {
        genericHook('onQuestion');
    }

    function onHtmlContent(element: any): void {
        genericHook('onHtmlContent', element);
    }

    // --- Lifecycle ---
    onUnmounted(() => {
        window.removeEventListener('message', () => {});
    });

    return {
        plugins,
        rootFolder,
        allPluginLoaded,
        init,
        embed,
        createEmbeddedIframe,
        createEmbeddedIframeFromTemplateName,
        broadcastMessage,
        onLoad,
        onChapterStart,
        onChapterEnd,
        onContentEnter,
        onContentLeave,
        onActivityStart,
        onActivityEnd,
        onQuestion,
        onHtmlContent,
    };
}
