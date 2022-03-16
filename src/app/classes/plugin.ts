import {ReplaySubject} from 'rxjs';

export interface Plugin {
    onLoad(): void
    onChapterStart(): void
    onChapterEnd(): void
    onContentEnter(): void
    onContentLeave(): void
    onActivityStart(): void
    onActivityEnd(): void
    onQuestion(): void
    onHtmlContent(element): void
}

export interface PluginEntry {
    initialized: ReplaySubject<boolean>
    plugin:Plugin
}