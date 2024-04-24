export class Settings {
    debug:boolean;
    font: string;
    fontSize: number;
    lineHeight: number;
    lang: string;
    theme: 'auto' | 'dark' | 'light';
    libraryMode: 'libraryUrl'|'libraryQlfUrl';
    customLibrairies: {name: string, url: string}[];
    devMode: boolean;
    isUserOptIn: boolean;
}


