import {Injectable} from '@angular/core';
import {Plugin, PluginEntry} from 'src/app/classes/plugin';
import {ReplaySubject} from 'rxjs';
import {EpocService} from './epoc.service';

@Injectable({
    providedIn: 'root'
})
export class PluginService implements Plugin {
    private initialized = false;
    private plugins:PluginEntry[] = [];
    public allPluginLoaded: Promise<boolean[]>;

    constructor(private epocService: EpocService) {}

    init(pluginFiles:string[] = []) {
        if (this.initialized) return;
        console.log('init plugins');
        this.initialized = true;
        const wrapper = Object.assign(document.createElement('div'),{className:'plugins-wrapper'});
        document.body.appendChild(wrapper);
        const pluginLoadingPromises:Promise<boolean>[] = [];
        pluginFiles.forEach((src) => {
            const pluginPromise: Promise<boolean> = new Promise((resolve, reject) => {
                const url = this.epocService.rootFolder.startsWith('assets/demo') ? `${document.baseURI}${this.epocService.rootFolder}${src}` : `${this.epocService.rootFolder}${src}`;
                const iframe = document.createElement('iframe');
                const uid = (Math.random() + 1).toString(36).substring(3);
                const html = `<body>
                    <script src="${document.baseURI}assets/js/plugin-api.js" uid="${uid}"></script>
                    <script src="${url}"></script>
                </body>`;
                iframe.sandbox.toggle('allow-scripts');
                iframe.classList.add('plugin', 'invisible');
                iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
                wrapper.appendChild(iframe);

                const context = {
                    url,
                    epoc: this.epocService.epoc
                };

                iframe.addEventListener('load', () => {
                    iframe.contentWindow.postMessage({
                        event: 'load',
                        context
                    }, '*');
                });
                window.addEventListener('message', (message) => {
                    if (message.data.pluginId && message.data.pluginId === uid) {
                        if (message.data.event === 'loaded') {
                            const plugin:PluginEntry = {uid, src, config: message.data.config};
                            this.plugins.push(plugin);
                            console.log(`Plugin ${message.data.pluginId} from ${src} has loaded with config`, message.data.config);
                            resolve(true);
                        }
                    }
                });
            });

            pluginLoadingPromises.push(pluginPromise)

            pluginPromise.then(() => console.log('done'))


            // const loader = await pluginLoader.load(url);
            // if (loader.Plugin) {
            //     pluginLoad.plugin = new loader.Plugin();
            // }
            // pluginLoad.initialized.next(true);
            // this.onLoad();
        });

        Promise.all(pluginLoadingPromises).then(() => console.log('both done'))

        this.allPluginLoaded = Promise.all(pluginLoadingPromises)
    }

    async embed(html: string) {
        await this.allPluginLoaded;
        console.log('both done embed')
        this.plugins.forEach((plugin) => {
            const iframeHtml = this.createEmbeddedIframe(plugin);
            // @ts-ignore
            html = html.replaceAll(plugin.config.shortcode, iframeHtml);
            console.log('replace '+plugin.config.shortcode);
        })
        // const pluginShortcodes = this.plugins.map(p => p.config.shortcode);
        // const regex = /\[#(.+)\]/gm;
        // const matches = html.match(regex);
        // if (!matches) return html;
        // for (const match of matches) {
        //     const pluginMatchIndex = pluginShortcodes.indexOf(match);
        //     if (pluginMatchIndex > -1) {
        //         const iframeHtml = this.createEmbeddedIframe(this.plugins[pluginMatchIndex])
        //         html = html.replace(match, iframeHtml);
        //     }
        // }
        return html;
    }

    createEmbeddedIframe (plugin: PluginEntry) {
        const iframe = document.createElement('iframe');
        const uid = (Math.random() + 1).toString(36).substring(3);
        iframe.sandbox.toggle('allow-scripts');
        iframe.className = 'plugin embed';
        if (plugin.config.template.endsWith('.html')) {
            const rootUrl = this.epocService.rootFolder.startsWith('assets/demo') ?
                `${document.baseURI}${this.epocService.rootFolder}` : `${this.epocService.rootFolder}`;
            iframe.src = rootUrl + plugin.src.split('/')[0] + '/' + plugin.config.template
        } else {
            const html = `<body>
                ${plugin.config.template}
                <script src="${document.baseURI}assets/js/plugin-api.js" uid="${plugin.uid}"></script>
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