import {Injectable} from '@angular/core';
import {Plugin, PluginEntry} from 'src/app/classes/plugin';
import {delayWhen} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';
import {EpocService} from './epoc.service';

// See : src/assets/js/plugin-loader/plugin-loader.js
declare var pluginLoader:{load(src)};

@Injectable({
    providedIn: 'root'
})
export class PluginService implements Plugin {
    private initialized = false;
    private plugins:PluginEntry[] = [];

    constructor(private epocService: EpocService) {}

    init(pluginFiles:string[] = []) {
        if (this.initialized) return;
        this.initialized = true;
        pluginFiles.forEach(async (src) => {
            const pluginLoad:PluginEntry = {initialized:new ReplaySubject(1), plugin: null};
            this.plugins.push(pluginLoad);
            const url = this.epocService.rootFolder.startsWith('assets/demo') ? `/${this.epocService.rootFolder}${src}` : `${this.epocService.rootFolder}${src}`;
            const loader = await pluginLoader.load(url);
            pluginLoad.plugin = new loader.Plugin();
            pluginLoad.initialized.next(true);
            this.onLoad();
        });
    }

    genericHook(name, ...args) {
        this.plugins.forEach(plugin => {
            plugin.initialized.subscribe(() => {
                if (plugin.plugin[name]) plugin.plugin[name](...args);
            })
        })
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