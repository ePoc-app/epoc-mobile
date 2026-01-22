export interface Plugin {
    onLoad(): void
    onChapterStart(): void
    onChapterEnd(): void
    onContentEnter(): void
    onContentLeave(): void
    onActivityStart(): void
    onActivityEnd(): void
    onQuestion(): void
    onHtmlContent(element: HTMLElement): void
}

export interface PluginEntry {
    uid: string;
    src: string;
    config: PluginConfig;
    embeds: string[]
}

export interface PluginConfig {
    shortcode: string;
    template: string;
    templateOrignalSrc: string;
}