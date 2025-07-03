import {uri} from '@epoc/epoc-types/dist/v2';

export class Settings {
    debug:boolean;
    font: string;
    fontSize: number;
    lineHeight: number;
    lang: string;
    theme: 'auto' | 'dark' | 'light';
    customLibrairies: uri[];
    devMode: boolean;
    isUserOptIn: boolean;
}


