import {Injectable} from '@angular/core';
import {Plugin, PluginEntry} from 'src/app/classes/plugin';
import {Epoc} from 'src/app/classes/epoc';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PluginService implements Plugin {
    private plugins:PluginEntry[] = [];
    private rootFolder;
    public allPluginLoaded: Promise<boolean[]>;
    public $message = new Subject();

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
                            // Check if the message is to set the iframe height
                            } else if (message.data.event === 'setIframeHeight') {
                                const selector = `embed-${plugin.uid}-${message.data.embedId}`;
                                const embedIframe = document.getElementById(selector) as HTMLIFrameElement;
                                if (!embedIframe) return;
                                embedIframe.style.height =  message.data.height + 'px';
                            // else redirect message from embed to main plugin iframe
                            } else {
                                pluginIframe.contentWindow.postMessage(message.data.payload, '*');
                            }
                        }

                        this.$message.next(message.data);
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
        // Find all shortcodes in the input string
        const shortcodes = html.match(/\[#[^\] ]+[^\]]*]/gm);
        if (!shortcodes) return html;
        for (const shortcode of shortcodes) {
            // Extract the shortcode name
            const shortcodeMatch = shortcode.match(/\[#(\S+)[^\]]*]/);
            if (shortcodeMatch) {
                const shortcodeName = `[#${shortcodeMatch[1]}]`;

                // Extract the key/value pairs
                const keyValuePairs = shortcode.match(/(\w+)="([^"]*)"/g);
                const data = {};
                if (keyValuePairs) {
                    for (const pair of keyValuePairs) {
                        const [key, value] = pair.match(/(\w+)="([^"]*)"/).slice(1);
                        data[key] = value;
                    }
                }
                const plugin = this.plugins.find(p => p.config.shortcode === shortcodeName);
                if (plugin){
                    const iframeHtml = await this.createEmbeddedIframe(plugin, data);
                    html = html.replace(shortcode, iframeHtml);
                }
            }
        }
        return html;
    }

    /**
     * Create an iframe with plugin html template. It could be either a file or inline html
     * @param plugin The plugin entry
     * @param data The optional data to init the plugin embed with
     */
    async createEmbeddedIframe(plugin: PluginEntry, data?: unknown) {
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
                const pluginData = JSON.parse('${JSON.stringify(data ? data : {})}')
            </script>
            <script src="${document.baseURI}assets/js/plugin-api-embed.js"></script>
        `;
        if (plugin.config.template.endsWith('.html')) {
            const rootUrl = this.rootFolder.startsWith('assets/demo') ? `${document.baseURI}${this.rootFolder}` : `${this.rootFolder}`;
            const templateUrl = rootUrl + plugin.src.split('/')[0] + '/' + plugin.config.template + `#${uid}-${uidEmbed}`;
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

    /**
     * Create an iframe with plugin html template.
     * @param templateName The name of the html template file
     * @param data The optional data to init the plugin embed with
     */
    async createEmbeddedIframeFromTemplateName (templateName: string, data?: unknown) {
        const pluginEntry = this.plugins.find(p => p.config.template === templateName);
        return await this.createEmbeddedIframe(pluginEntry, data);
    }

    broadcastMessage (message) {
        document.querySelectorAll('iframe').forEach(frame => {
            frame.contentWindow.postMessage(message, '*')
        });
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