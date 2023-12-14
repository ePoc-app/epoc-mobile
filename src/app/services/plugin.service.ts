import {Injectable} from '@angular/core';
import {Plugin, PluginEntry} from 'src/app/classes/plugin';
import {Epoc} from 'src/app/classes/epoc';

@Injectable({
    providedIn: 'root'
})
export class PluginService implements Plugin {
    private plugins:PluginEntry[] = [];
    private rootFolder;
    public allPluginLoaded: Promise<boolean[]>;

    constructor() {}

    /**
     * Load all plugins files from ePoc in a hidden iFrame and setup listeners
     * to communicate between app and plugin using a helper API plugin-api.js
     */
    init(rootFolder:string, epoc: Epoc) {
        if (!epoc.plugins) return;
        this.rootFolder = rootFolder;
        // Clear old wrapper and plugins
        document.querySelector('.plugins-wrapper')?.remove();
        this.plugins = [];
        // Create a node wrapper to host all hidden plugin iframes
        const wrapper = Object.assign(document.createElement('div'),{className:'plugins-wrapper'});
        document.body.appendChild(wrapper);
        const pluginLoadingPromises:Promise<boolean>[] = [];
        epoc.plugins.forEach((src) => {
            const pluginPromise: Promise<boolean> = new Promise((resolve, reject) => {
                // Create a non visible iframe for each plugin
                const url = rootFolder.startsWith('assets/demo') ? `${document.baseURI}${rootFolder}${src}` : `${rootFolder}${src}`;
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

                const context = {
                    url,
                    epoc
                };
                // Setup listener to received message from iframes (plugin or embeds)
                window.addEventListener('message', (message) => {
                    if (message.data.pluginId && message.data.pluginId === uid) {
                        // Setup listener when plugin iframe load and send message to retrieve config with context
                        if (message.data.event === 'load' && !this.plugins.some(p => p.uid === uid)) {
                            iframe.contentWindow.postMessage({
                                event: 'load',
                                context
                            }, '*');
                        }

                        // When plugin finished load store plugin config and infos
                        if (message.data.event === 'config' && !this.plugins.some(p => p.uid === uid)) {
                            const plugin:PluginEntry = {uid, src, config: message.data.config, embeds: []};
                            this.plugins.push(plugin);
                            resolve(true);
                        }

                        // Redirects messages 'to-embed' from plugin iframe to embeds iframes
                        if (message.data.event === 'to-embed') {
                            const plugin = this.plugins.find(p => p.uid === uid);
                            if (!plugin) return;
                            plugin.embeds.forEach((embedId) => {
                                const embedIframe = document.getElementById(`embed-${uid}-${embedId}`) as HTMLIFrameElement;
                                if (!embedIframe) return;
                                embedIframe.contentWindow.postMessage(message.data.payload, '*');
                            })
                        }

                        // Messages from embeds iframes
                        if (message.data.embedId) {
                            const plugin = this.plugins.find(p => p.uid === uid);
                            if (!plugin) return;
                            const pluginIframe = document.getElementById(`plugin-${plugin.uid}`) as HTMLIFrameElement;
                            // When embed finish load register new embed into plugin embeds list
                            if (message.data.event === 'embed-loaded') {
                                if (!plugin.embeds.includes(message.data.embedId)) {
                                    plugin.embeds.push(message.data.embedId);
                                    pluginIframe.contentWindow.postMessage({
                                        event: 'embed',
                                        embedId: message.data.embedId
                                    }, '*');
                                }
                            // else redirect message from embed to main plugin iframe
                            } else {
                                pluginIframe.contentWindow.postMessage(message.data.payload, '*');
                            }
                        }
                    }
                });
            });

            pluginLoadingPromises.push(pluginPromise)
        });

        this.allPluginLoaded = Promise.all(pluginLoadingPromises)
    }

    /**
     * Replace all shortcodes in html components by a template in an iframe
     * @param html a string containing html content
     */
    async embed(html: string) {
        await this.allPluginLoaded;
        const regex = /\[#([^\[#]+)\]/gm;
        const matches = html.match(regex);
        if (!matches) return html;
        for (const match of matches) {
            const plugin = this.plugins.find(p => p.config.shortcode === match);
            if (plugin){
                const iframeHtml = this.createEmbeddedIframe(plugin);
                html = html.replace(plugin.config.shortcode, iframeHtml);
            }
        }
        return html;
    }

    /**
     * Create an iframe with plugin html template. It could be either a file or inline html
     * @param plugin The plugin entry
     */
    createEmbeddedIframe (plugin: PluginEntry) {
        const iframe = document.createElement('iframe');
        const uid = plugin.uid;
        const uidEmbed = (Math.random() + 1).toString(36).substring(3);
        iframe.sandbox.toggle('allow-scripts');
        iframe.className = 'plugin embed';
        iframe.id = `embed-${uid}-${uidEmbed}`;
        if (plugin.config.template.endsWith('.html')) {
            const rootUrl = this.rootFolder.startsWith('assets/demo') ?
                `${document.baseURI}${this.rootFolder}` : `${this.rootFolder}`;
            iframe.src = rootUrl + plugin.src.split('/')[0] + '/' + plugin.config.template + `#${uid}-${uidEmbed}`
        } else {
            const html = `<body>
                ${plugin.config.template}
                <script src="${document.baseURI}assets/js/plugin-api-embed.js" uid="${uid}-${uidEmbed}"></script>
            </body>`;
            iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
        }
        return iframe.outerHTML;
    }

    genericHook(name, ...args) {
        /*this.plugins.forEach(plugin => {
            plugin.initialized.subscribe(() => {
                if (plugin.plugin && plugin.plugin[name]) plugin.plugin[name](...args);
            })
        })*/
    }

    onLoad(): void {
        this.genericHook('onLoad')
    }

    onChapterStart(): void {
        this.genericHook('onChapterStart')
    }

    onChapterEnd(): void {
        this.genericHook('onChapterEnd')
    }

    onContentEnter(): void {
        this.genericHook('onContentEnter')
    }

    onContentLeave(): void {
        this.genericHook('onContentLeave')
    }

    onActivityStart(): void {
        this.genericHook('onActivityStart')
    }

    onActivityEnd(): void {
        this.genericHook('onActivityEnd')
    }

    onQuestion(): void {
        this.genericHook('onQuestion')
    }

    onHtmlContent(element): void {
        this.genericHook('onHtmlContent', element)
    }
}